const transform = (tags) => tags
	.split(', ')
	.map(str => {
		return {
			name: str,
			id: str.toLowerCase().replace(/'/gi, '').replace(/ /gi, '-')
		};
	});

const fashion = transform(
	'Watches, Glasses and sunglasses, Textiles, hair, Kid\'s fashion, Shoes, jewelry, Bags, wigs, Lingerie, Trousers, Blouse, Hats, Scarf, Belt, Waste trainers, Sport wears, Sneakers, Gown'
);
const computing = transform(
	'Hp, Lenovo, Apple, Dell, Toshiba, Samsung, Asus, Acer, Sony, LG, accessories, Canon, Brother, Printer, Xerox, Mouse, D-Link, Huawei, SanDisk'
);
const mobile = transform(
	'Nokia, Tecno, Samsung, Lenovo, Infinix, Iphone, Gionee, Power bank, Wireless bluetooth, Xiaomi Redmi, Oppo, Itel, SanDisk, Huawei, Earphones, Apple'
);
const electronics = transform(
	'LED TV, OLED TV, Plasma TV, Smart TV, Curved TV, Samsung, LG, Sony, Sharp'
);
const home = transform(
	'Furniture, Acrylic, Fridge, Washing machine, Cooker, Microwave, Kettle, Dining table, Chair, Table, Cabinets'
);
const automobile = transform(
	'Tyres and rims, Lubricants, Grease, Spark plug, Nissan, Toyota, Honda, Mercedes Benz, Volkswagen, Kia, Camry, Lexus'
);
const sporting = transform(
	'Soccer, Jersey, Table tennis, Badminton, Ball, Racket, Fitness, Cycling, Shin Guard, Booty'
);
const fragrance = transform(
	'Fragrance, Men\'s fragrance, Women\'s fragrance, Makeup, Wigs, Oils, Clippers, Body spray'
);

export default {
	3: home,
	4: mobile,
	5: computing,
	6: electronics,
	7: fashion,
	10: sporting,
	11: automobile,
	2: fragrance
};
