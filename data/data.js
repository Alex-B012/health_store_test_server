const pharmacies_codes = [1, 10, 11, 12, 13, 14, 15];
const roles = ["admin", "manager", "seller"];
const warehouse_employees = [20001, 20002, 20003, 20004, 20005];
const product_names = [
  "Инотекс",
  "Фенолайф",
  "Цитикомед - Раствор для инъекций",
  "Андропрост Плюс",
  "Андросан",
  "Випонефрон",
  "Аминоприм",
  "Тест товар 1",
  "Тест товар 2",
  "Тест товар 3",
  "Тест товар 4",
  "Тест товар 5",
  "Тест товар 6",
  "Тест товар 7",
  "Тест товар 8",
  "Тест товар 9",
  "Тест товар 10",
];

const SELLERS = [
  {
    name: { name: "Иван", patronymic: "Сергеевич", surname: "Петров" },
    dob: new Date("1990-04-12"),
    employmentPeriod: {
      status: "active",
      startDate: new Date("2012-06-01"),
      endDate: null,
    },
    location_id: 12,
    telegram_id: 83472910,
  },
  {
    name: { name: "Анна", patronymic: "Сергеевна", surname: "Иванова" },
    dob: new Date("1992-05-17"),
    employmentPeriod: {
      status: "active",
      startDate: new Date("2014-04-01"),
      endDate: null,
    },
    location_id: 11,
    telegram_id: 67584930,
  },
  {
    name: { name: "Дмитрий", patronymic: "Александрович", surname: "Иванов" },
    dob: new Date("1985-09-23"),
    employmentPeriod: {
      status: "active",
      startDate: new Date("2008-03-15"),
      endDate: null,
    },
    location_id: 14,
    telegram_id: 92837465,
  },
  {
    name: { name: "Сергей", patronymic: "Николаевич", surname: "Смирнов" },
    dob: new Date("1978-01-30"),
    employmentPeriod: {
      status: "active",
      startDate: new Date("2002-11-10"),
      endDate: null,
    },
    location_id: 10,
    telegram_id: 56473829,
  },
  {
    name: { name: "Екатерина", patronymic: "Дмитриевна", surname: "Кузнецова" },
    dob: new Date("1988-10-09"),
    employmentPeriod: {
      status: "active",
      startDate: new Date("2010-06-20"),
      endDate: null,
    },
    location_id: 13,
    telegram_id: 84736251,
  },
  {
    name: { name: "Алексей", patronymic: "Дмитриевич", surname: "Волков" },
    dob: new Date("1998-07-19"),
    employmentPeriod: {
      status: "active",
      startDate: new Date("2020-08-01"),
      endDate: null,
    },
    location_id: 15,
    telegram_id: 19283746,
  },
  {
    name: { name: "Мария", patronymic: "Павловна", surname: "Соколова" },
    dob: new Date("1995-02-25"),
    employmentPeriod: {
      status: "active",
      startDate: new Date("2017-03-10"),
      endDate: null,
    },
    location_id: 10,
    telegram_id: 73625184,
  },
];

const MANAGERS = [
  {
    name: { name: "Александр", patronymic: "Викторович", surname: "Орлов" },
    dob: new Date("1980-06-14"),
    employmentPeriod: {
      status: "active",
      startDate: new Date("2003-09-01"),
      endDate: null,
    },
    location_id: 1,
    telegram_id: 91827364,
  },
  {
    name: { name: "Максим", patronymic: "Андреевич", surname: "Федоров" },
    dob: new Date("1991-11-22"),
    employmentPeriod: {
      status: "active",
      startDate: new Date("2013-05-10"),
      endDate: null,
    },
    location_id: 1,
    telegram_id: 82736455,
  },
  {
    name: { name: "Ольга", patronymic: "Сергеевна", surname: "Морозова" },
    dob: new Date("1987-03-08"),
    employmentPeriod: {
      status: "active",
      startDate: new Date("2009-04-15"),
      endDate: null,
    },
    location_id: 1,
    telegram_id: 73645582,
  },
  {
    name: { name: "Наталья", patronymic: "Дмитриевна", surname: "Васильева" },
    dob: new Date("1993-07-19"),
    employmentPeriod: {
      status: "active",
      startDate: new Date("2015-08-01"),
      endDate: null,
    },
    location_id: 1,
    telegram_id: 64558291,
  },
  {
    name: { name: "Елена", patronymic: "Павловна", surname: "Новикова" },
    dob: new Date("1985-12-02"),
    employmentPeriod: {
      status: "active",
      startDate: new Date("2007-02-20"),
      endDate: null,
    },
    location_id: 1,
    telegram_id: 55482917,
  },
];

const ADMINS = [
  {
    admin_id: 1,
    name: {
      name: "Андрей",
      patronymic: "Николаевич",
      surname: "Крылов",
    },
    dob: new Date("1999-08-11"),
    contacts: {
      email: "andrey.krylov@example.com",
      phone: "+79161234567",
    },
    employmentPeriod: {
      status: "active",
      startDate: new Date("2002-03-01"),
      endDate: null,
    },
    location_id: 1,
  },
  {
    admin_id: 2,
    name: {
      name: "Татьяна",
      patronymic: "Викторовна",
      surname: "Белова",
    },
    dob: new Date("1996-04-27"),
    contacts: {
      email: "tatyana.belova@example.com",
      phone: "+79261239876",
    },
    employmentPeriod: {
      status: "active",
      startDate: new Date("2008-06-15"),
      endDate: null,
    },
    location_id: 1,
  },
  {
    admin_id: 3,
    name: {
      name: "Игорь",
      patronymic: "Сергеевич",
      surname: "Жуков",
    },
    dob: new Date("2002-10-03"),
    contacts: {
      email: "igor.zhukov@example.com",
      phone: "+79361234589",
    },
    employmentPeriod: {
      status: "active",
      startDate: new Date("2014-09-10"),
      endDate: null,
    },
    location_id: 1,
  },
];

const PHARMACIES = [
  {
    name: "Аптека Здоровье+",
    pharmacyNumber: "10",
    addedAt: new Date("2026-02-15T10:24:00"),
    address: {
      city: "Москва",
      street: "Ленинский проспект",
      buildingNumber: "12",
      province: "",
      zipCode: "119049",
    },
    contact: {
      phone: "4951234567",
      mobilePhone: "89651234567",
      email: "info@zdorovye.ru",
      fax: "4951234568",
      website: "https://zdorovye.ru",
    },
    management: [
      {
        role: "Менеджер",
        name: "Иван Иванов",
        roomNumber: "101",
        phone: "4951234569",
        mobilePhone: "89651234568",
        email: "ivan.ivanov@zdorovye.ru",
      },
    ],
    businessHours: [
      { day: "Понедельник", open: "08:00", close: "20:00" },
      { day: "Вторник", open: "08:00", close: "20:00" },
      { day: "Среда", open: "08:00", close: "20:00" },
      { day: "Четверг", open: "08:00", close: "20:00" },
      { day: "Пятница", open: "08:00", close: "20:00" },
      { day: "Суббота", open: "09:00", close: "18:00" },
      { day: "Воскресенье", open: "10:00", close: "16:00" },
    ],
  },
  {
    name: "Аптека Здоровье+",
    pharmacyNumber: "11",
    addedAt: new Date("2026-01-28T14:10:00"),
    address: {
      city: "Санкт-Петербург",
      street: "Невский проспект",
      buildingNumber: "45",
      province: "",
      zipCode: "191025",
    },
    contact: {
      phone: "8122345678",
      mobilePhone: "89812345678",
      email: "spb@zdorovye.ru",
      fax: "8122345679",
      website: "https://zdorovye-spb.ru",
    },
    management: [
      {
        role: "Менеджер",
        name: "Анна Петрова",
        roomNumber: "202",
        phone: "8122345680",
        mobilePhone: "89812345679",
        email: "anna.petrova@zdorovye-spb.ru",
      },
    ],
    businessHours: [
      { day: "Понедельник", open: "08:00", close: "20:00" },
      { day: "Вторник", open: "08:00", close: "20:00" },
      { day: "Среда", open: "08:00", close: "20:00" },
      { day: "Четверг", open: "08:00", close: "20:00" },
      { day: "Пятница", open: "08:00", close: "20:00" },
      { day: "Суббота", open: "09:00", close: "18:00" },
      { day: "Воскресенье", open: "10:00", close: "16:00" },
    ],
  },
  {
    name: "Аптека Фармия",
    pharmacyNumber: "12",
    addedAt: new Date("2026-03-05T09:50:00"),
    address: {
      city: "Казань",
      street: "Баумана",
      buildingNumber: "33",
      province: "Республика Татарстан",
      zipCode: "420111",
    },
    contact: {
      phone: "8431234567",
      mobilePhone: "89831234567",
      email: "info@raduga.ru",
      fax: "8431234568",
      website: "https://raduga.ru",
    },
    management: [
      {
        role: "Менеджер",
        name: "Мария Сидорова",
        roomNumber: "303",
        phone: "8431234569",
        mobilePhone: "89831234568",
        email: "maria.sidorova@raduga.ru",
      },
    ],
    businessHours: [
      { day: "Понедельник", open: "08:00", close: "21:00" },
      { day: "Вторник", open: "08:00", close: "21:00" },
      { day: "Среда", open: "08:00", close: "21:00" },
      { day: "Четверг", open: "08:00", close: "21:00" },
      { day: "Пятница", open: "08:00", close: "21:00" },
      { day: "Суббота", open: "09:00", close: "19:00" },
      { day: "Воскресенье", open: "10:00", close: "17:00" },
    ],
  },
  {
    name: "Аптека Фармия",
    pharmacyNumber: "13",
    addedAt: new Date("2026-02-20T16:30:00"),
    address: {
      city: "Новосибирск",
      street: "Красный проспект",
      buildingNumber: "77",
      province: "Новосибирская область",
      zipCode: "630099",
    },
    contact: {
      phone: "3831234567",
      mobilePhone: "89381234567",
      email: "novosibirsk@raduga.ru",
      fax: "3831234568",
      website: "https://raduga-nsk.ru",
    },
    management: [
      {
        role: "Менеджер",
        name: "Сергей Кузнецов",
        roomNumber: "404",
        phone: "3831234569",
        mobilePhone: "89381234568",
        email: "sergey.kuznetsov@raduga-nsk.ru",
      },
    ],
    businessHours: [
      { day: "Понедельник", open: "08:00", close: "21:00" },
      { day: "Вторник", open: "08:00", close: "21:00" },
      { day: "Среда", open: "08:00", close: "21:00" },
      { day: "Четверг", open: "08:00", close: "21:00" },
      { day: "Пятница", open: "08:00", close: "21:00" },
      { day: "Суббота", open: "09:00", close: "19:00" },
      { day: "Воскресенье", open: "10:00", close: "17:00" },
    ],
  },
  {
    name: "Аптека Солнце",
    pharmacyNumber: "14",
    addedAt: new Date("2026-03-12T11:15:00"),
    address: {
      city: "Екатеринбург",
      street: "Ленина",
      buildingNumber: "21",
      province: "Свердловская область",
      zipCode: "620014",
    },
    contact: {
      phone: "3431234567",
      mobilePhone: "89343123456",
      email: "info@solnce.ru",
      fax: "3431234568",
      website: "https://solnce.ru",
    },
    management: [
      {
        role: "Менеджер",
        name: "Алексей Смирнов",
        roomNumber: "101",
        phone: "3431234569",
        mobilePhone: "89343123457",
        email: "aleksey.smirnov@solnce.ru",
      },
    ],
    businessHours: [
      { day: "Понедельник", open: "09:00", close: "21:00" },
      { day: "Вторник", open: "09:00", close: "21:00" },
      { day: "Среда", open: "09:00", close: "21:00" },
      { day: "Четверг", open: "09:00", close: "21:00" },
      { day: "Пятница", open: "09:00", close: "21:00" },
      { day: "Суббота", open: "10:00", close: "18:00" },
      { day: "Воскресенье", open: "10:00", close: "16:00" },
    ],
  },
  {
    name: "Аптека Лилия",
    pharmacyNumber: "15",
    addedAt: new Date("2026-01-10T08:45:00"),
    address: {
      city: "Владивосток",
      street: "Океанский проспект",
      buildingNumber: "55",
      province: "Приморский край",
      zipCode: "690091",
    },
    contact: {
      phone: "4231234567",
      mobilePhone: "89231234567",
      email: "info@liliya.ru",
      fax: "4231234568",
      website: "https://liliya.ru",
    },
    management: [
      {
        role: "Менеджер",
        name: "Наталья Морозова",
        roomNumber: "201",
        phone: "4231234569",
        mobilePhone: "89231234568",
        email: "natalya.morozova@liliya.ru",
      },
    ],
    businessHours: [
      { day: "Понедельник", open: "08:00", close: "20:00" },
      { day: "Вторник", open: "08:00", close: "20:00" },
      { day: "Среда", open: "08:00", close: "20:00" },
      { day: "Четверг", open: "08:00", close: "20:00" },
      { day: "Пятница", open: "08:00", close: "20:00" },
      { day: "Суббота", open: "09:00", close: "18:00" },
      { day: "Воскресенье", open: "10:00", close: "16:00" },
    ],
  },
];

export {
  pharmacies_codes,
  roles,
  warehouse_employees,
  product_names,
  SELLERS,
  MANAGERS,
  ADMINS,
  PHARMACIES,
};
