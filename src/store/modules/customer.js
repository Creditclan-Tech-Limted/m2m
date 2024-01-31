const state = {
	id: null,
	avatar: '',
	personal: {
		full_name: '',
		email: '',
		phone: '',
		gender: '',
		address: '',
		date_of_birth: '',
		state: null,
		lga: null
	},
	work: {
		company_name: '',
		net_monthly_income: '',
		occupation: '',
		sector: '',
		work_address: '',
	},
	account: {
		bank_id: '',
		account_number: '',
		account_name: '',
		bank_code: ''
	},
	frequently_called_numbers: [],
	identity: {
		type: null,
		value: null,
		bvn: null
	},
	card: null
};

const getters = {
	valid(state) {
		return ['personal', 'work', 'identity'].every((form) => {
			return state[form] && Object.keys(state[form]).every(key => state[form][key]);
		}) && state.avatar && state.frequently_called_numbers.length >= 3;
	},
	completed: (state) => (form) => {
		return state[form] && Object.keys(state[form]).every(key => state[form][key]);
	},
	profileValid: (state) => {
		return ['personal', 'work'].every((form) => {
			return state[form] && Object.keys(state[form]).every(key => state[form][key]);
		}) && state.avatar
	},
	fcn: (state) => {
		return state.frequently_called_numbers
	}
};

const mutations = {
	set: (state, data) => {
		Object.keys(data).forEach(key => {
			state[key] = data[key];
		})
	},
	prefill: (state, data) => {
		const {
			picture, id, full_name, gender, date_of_birth, address, phone, email, account_name, account_number,
			bank_code, bank_id, work, frequently_called_numbers, identity, card, state: _state, lga
		} = data;
		state.id = id;
		state.avatar = picture || '';
		state.personal = { ...state.personal, full_name, email, phone, address, gender, date_of_birth, state: _state, lga };
		state.account = { account_number, bank_id: `${ bank_id }`, account_name, bank_code };
		state.work = work || {
			company_name: '',
			net_monthly_income: '',
			occupation: '',
			sector: '',
			work_address: '',
		};
		state.frequently_called_numbers = JSON.parse(frequently_called_numbers) || []
		state.identity = JSON.parse(identity)
		state.card = JSON.parse(card)
	},
	update: (state, { key, value }) => {
		state[key] = value
	}
};

const actions = {};

const customer = {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
};

export default customer;
