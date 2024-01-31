import http from "../../plugins/http";
import { roundToNearestTen } from "@/lib/utils.js";

const state = {
  id: null,
  items: [],
  req_status: 0,
  request_schedule: [],
  no_of_months: 0,
  upfront_amt: 0,
  customer: {},
  bs_transaction_id: null,
  upfront_paid: null,
  cred_plus_upfront: 0,
  eligibility_data: null,
  creditclan_request_id: null,
  stages: {},
  stage: 0,
  analysis_completed: [],
  email_verified: 0,
  offer: null,
  slug: null,
  whatsapp_order: 0,
  global_request_id: null,
  cc_request: null,
  payment_status: 0,
};

const getters = {
  paid(state) {
    return state.payment_status === 1;
  },
  hasOffer(state) {
    return state.cc_request?.loan?.offer_selected;
  },
  stage(state) {
    return state?.cc_request?.loan?.stage;
  },
  status(state) {
    return +state.cc_request?.loandetails?.LOAN_STATUS || 0;
  },
  upfrontAmount(state, getters) {
    return state.cc_request?.loan?.offer_selected?.upfront || getters.totalUpfront || 0;
  },
  noOfMonths(state) {
    if (!state.cc_request) return state.no_of_months;
    if (!state.cc_request.loan.offer_selected) return state.no_of_months;
    return state.cc_request.loan.offer_selected.duration;
  },
  totalUpfront(state) {
    return state.items.reduce((acc, item) => acc + ((item?.plan?.upfront || 0) * (+item.plan?.unit || 1)), 0);
  },
  totalOutright(state) {
    return state.items.reduce((acc, item) => acc + ((item?.plan?.outright || 0) * (+item.plan?.unit || 1)), 0);
  },
  totalAmount(state) {
    let total = state.items.reduce((acc, item) => acc + ((item?.plan?.total) * (+item.plan?.unit || 1)), 0);
    return roundToNearestTen(total);
  },
  totalMonthlyAmountEstimate(state, getters) {
    return roundToNearestTen(getters.totalAmount / getters.noOfMonths);
  },
  monthlyAmount(state, getters) {
    if (!state.cc_request) return getters.totalMonthlyAmountEstimate;
    if (!state.cc_request.loan.offer_selected) return getters.totalMonthlyAmountEstimate;
    return state.cc_request.loan.offer_selected.monthly_repayment;
  },
  schedule(state) {
    if (state.cc_request?.loan?.offer_selected) {
      return state.cc_request?.schedule?.map((s, i) => ({
        date: s.repayment_date,
        serial: i + 1,
        amount: +s.how_much_paid + +s.how_much_remaining,
        amount_paid: +s.how_much_paid,
        paid: +s.how_much_remaining === 0,
      })) || [];
    }
    return request?.request_schedule || [];
  },
  nextPayment(state, getters) {
    const unpaidSchedules = getters.schedule.filter(s => {
      return (new Date(Date.now()) > new Date(s.date) && +s.amount_paid < +s.amount)
    });
    const debt = unpaidSchedules.reduce((acc, s) => {
      acc += +s.amount - +s.amount_paid;
      return acc;
    }, 0);
    const next = getters.schedule.find(s => {
      return (new Date(Date.now()) < new Date(s.date) && +s.amount_paid < +s.amount)
    });
    const amount = (next ? +next.amount - +next.amount_paid : 0) + debt;
    return next ? ({
      amount,
      date: next.date,
      ids: [...unpaidSchedules.map(s => s.id), next.id]
    }) : {
      amount,
      date: unpaidSchedules[unpaidSchedules.length - 1] ? unpaidSchedules[unpaidSchedules.length - 1].date : null,
      ids: unpaidSchedules.map(s => s.id)
    };
  },
  amountDue(state, getters) {
    return getters.schedule.reduce((acc, schedule) => {
      const today = new Date(Date.now());
      const date = new Date(schedule.date);
      if (today > date) {
        acc += +schedule.amount - +schedule.amount_paid
      }
      return acc;
    }, 0)
  },
  paymentTillDate(state, getters) {
    return getters.schedule.reduce((acc, schedule) => {
      acc += +schedule.amount_paid;
      return acc;
    }, 0);
  },
  balance(state, getters) {
    return getters.schedule.reduce((acc, schedule) => {
      if (schedule.amount_paid) {
        acc += +schedule.amount - +schedule.amount_paid
      } else {
        acc += +schedule.amount
      }
      return acc;
    }, 0)
  },
  previewItems(state) {
    return state.items.slice(0, 2);
  },
  analysisDone(state) {
    return state.cc_request?.loan?.stage === 'completed';
  },
  emailVerified(state) {
    return state.email_verified;
  },
  credit() {
    return +state.no_of_months > 0
  },
};

const mutations = {
  set: (state, data) => {
    Object.keys(data).forEach(key => {
      state[key] = data[key];
    })
  },
  clear: (state) => {
    Object.keys(state).forEach(key => {
      state[key] = null;
    })
  }
};

const actions = {
  async load({ commit }, id) {
    try {
      const res = await http.get(`https://sellbackend.creditclan.com/merchantclan/public/index.php/api/globalrequest/${ id }`);
      const requests = res.data.data;
      const items = requests.reduce((acc, req) => {
        acc = [...acc, ...req.items];
        return acc;
      }, []);
      const {
        customer,
        slug,
        req_date,
        req_status,
        global_request_id,
        email_verified,
        lender,
        creditclan_request_id,
        payment_status,
      } = requests[0];
      if (creditclan_request_id) {
        const { data } = await http.post(`https://mobile.creditclan.com/api/v3/customer/check/details`, {
          email: customer.email, phone: customer.phone
        }, { headers: { 'x-api-key': 'WE4mwadGYqf0jv1ZkdFv1LNPMpZHuuzoDDiJpQQqaes3PzB7xlYhe8oHbxm6J228' } });
        const { token } = data;
        const res = await http.post('https://mobile.creditclan.com/api/v3/loan/details', {
          token, request_id: creditclan_request_id
        }, { headers: { 'x-api-key': 'WE4mwadGYqf0jv1ZkdFv1LNPMpZHuuzoDDiJpQQqaes3PzB7xlYhe8oHbxm6J228' } });
        commit('set', { cc_request: res.data.data });
      }
      const _items = items.map(item => ({
        ...item,
        plan: item.plan ? JSON.parse(item.plan) : {
          monthly: +item.monthly_amount,
          unit: item.unit || 1,
          duration: +item.no_of_months,
          total: +item.monthly_amount & +item.no_of_months,
        }
      }));
      const request = {
        items: _items,
        no_of_months: Math.max(..._items.map(item => item?.plan?.duration || 0)) || 3,
        analysis_completed: [],
        bs_transaction_id: null,
        bs_unique_id: null,
        created_at: null,
        cred_plus_upfront: 0,
        creditclan_request_id,
        customer,
        eligibility_data: null,
        email_verified: email_verified === '1',
        monthly_amt: 0,
        offer: null,
        payment_type: 0,
        req_date,
        req_status: +req_status || null,
        request_schedule: [],
        slug,
        stage: 0,
        total_credit: 0,
        upfront_amt: 0,
        upfront_paid: 0,
        whatsapp_order: 0,
        global_request_id,
        lender,
        payment_status,
      };
      commit('set', { ...request });
      commit('customer/prefill', request.customer, { root: true });
    } catch (e) {
      console.log(e)
    }
  },
  async resolveId(_, slug) {
    const { data: { data } } = await http.get(`/3/slug/${ slug }`);
    return data;
  },
  async cancel({ state, getters }) {
    if (getters.paid) return;
    const { global_request_id, creditclan_request_id } = state;
    await http.delete(`https://sellbackend.creditclan.com/merchantclan/public/index.php/api/global/request/cancel?global_request_id=${ global_request_id }`)
    if (creditclan_request_id) {
      await http.post(`https://mobile.creditclan.com/api/v3/cancel/loan_request`, { request_id: creditclan_request_id }, {
        headers: { 'x-api-key': 'WE4mwadGYqf0jv1ZkdFv1LNPMpZHuuzoDDiJpQQqaes3PzB7xlYhe8oHbxm6J228' }
      });
    }
  }
};

const request = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};

export default request;
