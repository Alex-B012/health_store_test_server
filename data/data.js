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

const sellers = [
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

const managers = [
  {
    name: "Александр Викторович Орлов",
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
    name: "Максим Андреевич Федоров",
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
    name: "Ольга Сергеевна Морозова",
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
    name: "Наталья Дмитриевна Васильева",
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
    name: "Елена Павловна Новикова",
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

const admins = [
  {
    name: "Андрей Николаевич Крылов",
    dob: new Date("1979-08-11"),
    employmentPeriod: {
      status: "active",
      startDate: new Date("2002-03-01"),
      endDate: null,
    },
    location_id: 1,
  },
  {
    name: "Татьяна Викторовна Белова",
    dob: new Date("1986-04-27"),
    employmentPeriod: {
      status: "active",
      startDate: new Date("2008-06-15"),
      endDate: null,
    },
    location_id: 1,
  },
  {
    name: "Игорь Сергеевич Жуков",
    dob: new Date("1992-10-03"),
    employmentPeriod: {
      status: "active",
      startDate: new Date("2014-09-10"),
      endDate: null,
    },
    location_id: 1,
  },
];

export {
  pharmacies_codes,
  roles,
  warehouse_employees,
  product_names,
  sellers,
  managers,
  admins,
};
