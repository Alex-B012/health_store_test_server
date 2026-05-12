const pharmacies_codes = [1, 9, 10, 11, 12, 13, 14, 15];
const roles = ["admin", "manager", "seller"];
const warehouse_employees = [20001, 20002, 20003, 20004, 20005];

const PRODUCTS = [
  {
    name: "Product test 01",
    name_id: 1,
    stock_entry: {
      qr_code: "\x1D0104602441024650215ormOJdNxoNzv\x1D93bwZV",
      date: "2026-04-24T18:47:24.713+00:00",
      employee_id: 2005,
    },
    pharmacy_id: 9,
  },
  {
    name: "Product test 02",
    name_id: 1,
    stock_entry: {
      qr_code: "\x1D0104600682042266215yf>MOM\x1D93Oxlh",
      date: "2026-04-25T10:47:24.713+00:00",
      employee_id: 2005,
    },
    pharmacy_id: 13,
  },
  {
    name: "Product test 03",
    name_id: 2,
    stock_entry: {
      qr_code: "\x1D0104603934000939215DgR<76nW/nBb\x1D93PxBc",
      date: "2026-04-27T12:17:05.713+00:00",
      employee_id: 2005,
    },
    pharmacy_id: 9,
  },
  {
    name: "Product test 04",
    name_id: 2,
    stock_entry: {
      qr_code: "\x1D0104603334003639215bhLVroj:)cW%\x1D93oEVI",
      date: "2026-04-27T21:35:42.713+00:00",
      employee_id: 2005,
    },
    pharmacy_id: 9,
  },
  {
    name: "Product test 05",
    name_id: 2,
    stock_entry: {
      qr_code: `\x1D01046301784301542157F7dI"\x1D93hrhX`,
      date: "2026-05-05T11:12:02.713+00:00",
      employee_id: 2005,
    },
    pharmacy_id: 9,
  },
  {
    name: "Product test 06",
    name_id: 2,
    stock_entry: {
      qr_code: `\x1D0104607975854582215vIaLe+D)tiG%\x1D93b6N1`,
      date: "2026-05-05T13:49:32.713+00:00",
      employee_id: 2005,
    },
    pharmacy_id: 9,
  },
  {
    name: "Product test 07 R",
    name_id: 5,
    stock_entry: {
      qr_code:
        "\x1D0104607035890505215IHCxg\x1D91EE11\x1D92Rn9a9i3htokScp5/gqw4O0fG311HLlPCN1hbQjw8RLI=",
      date: "2026-05-02T13:50:15.713+00:00",
      employee_id: 2005,
    },
    pharmacy_id: 10,
  },
  {
    name: "Product test 08 R",
    name_id: 5,
    stock_entry: {
      qr_code: "\x1D0104602014010561215j2>>>\x1D93oY/z",
      date: "2026-05-02T13:52:15.713+00:00",
      employee_id: 2005,
    },
    pharmacy_id: 13,
  },
  {
    name: "Product test 09",
    name_id: 5,
    stock_entry: {
      qr_code: "\x1D0104600494602191215OkyPmf'zrBD?\x1D93jStG",
      date: "2026-05-08T08:21:15.713+00:00",
      employee_id: 2005,
    },
    pharmacy_id: 9,
  },
  {
    name: "Product test 10",
    name_id: 5,
    stock_entry: {
      qr_code: "\x1D0104600721024895215qO-dET\x1D93tOxL",
      date: "2026-05-08T13:13:19.713+00:00",
      employee_id: 2005,
    },
    pharmacy_id: 9,
  },
];

const PRODUCTS_NAMES = [
  {
    name: "Инотекс",
    name_id: 1,
    brief_description: "Нестероидный противовоспалительный препарат",
    description:
      "Быстрое обезболивание, Продолжительное действие, Удобство при невозможности приёма внутрь, Мощное противовоспалительное действие, Меньшая нагрузка на желудочно-кишечный тракт, Остеоартроз, ревматоидный артрит, Анкилозирующий спондилоартрит, Болевой синдром: тендинит, бурсит, радикулит, полиартрит, Купирование боли при остром подагрическом артрите",
  },
  {
    name: "Фенолайф",
    name_id: 2,
    brief_description: "Вагинальные свечи",
    description:
      "Местное лечение вульвита, вагинита и цервикальных инфекций, Противогрибковое, Трихоцидное, Антибактериальное и противовоспалительное локальное действие",
  },
  {
    name: "Цитикомед",
    name_id: 3,
    brief_description: "Раствор для инъекций",
    description:
      "Острый период ишемического инсульта, Восстановительный период после ишемического и геморрагического инсульта, Черепно-мозговая травма, острый и восстановительный период, Вызванные дегенеративными и сосудистыми заболеваниями когнитивные, сенситивные и двигательные расстройства, в том числе, болезни Паркинсона и Альцгеймера",
  },
  {
    name: "Андропрост Плюс",
    name_id: 4,
    brief_description: "Средство для лечения хронического простатита",
    description:
      "Острый и хронический бактериальный простатит, Инфекционно-воспалительный заболевания, вызванные чувствительными к ломефлоксацину микроорганизмами, Состояния до и после оперативного вмешательства на предстательной железе",
  },
  {
    name: "Андросан",
    name_id: 5,
    brief_description: "Биологически активная добавка",
    description:
      "Улучшает функциональное состояние мочеполовой системы у мужчин, Повышает эректильную функцию и укрепляет предстательную железу, Нормализируют и активизирует функции простаты, В качестве вспомогательных элементов комплексной поддержки – при начальных стадиях воспаления предстательной железы, Для предохранения тканей предстательной железы от оксидантного стресса и действия токсинов, Устраняет и уменьшает функциональные расстройства мочеиспускания – дизурию, поллакиурию, никтурию при заболеваниях предстательной железы,  Для увеличения количества и подвижности сперматозоидов, нормализации их структуры; в качестве факторов, влияющих на образование тестостерона, а также гормонов щитовидной железы",
  },
  {
    name: "Випонефрон",
    name_id: 6,
    brief_description:
      "Растительный препарат для защиты мочевыделительной системы",
    description:
      "Растительный препарат для защиты мочевыделительной системы, Снижение риска образования мочекаменных болезней, Нормализация функций мочевыводящих путей и почек, В комплексном лечении неспецифических инфекций мочевыводящих путей (уретрит, цистит, пиелит), При мочекаменной болезни для размягчения и удаления фосфатных и оксалатных камней, Для лечения подагры, Для облегчения приступов почечной колики, В комплексной терапии недержания мочи у женщин, Улучшает состояние простаты у мужчин",
  },
  {
    name: "Аминоприм",
    name_id: 7,
    brief_description: "Добавка для парентерального питания",
    description:
      "Острая и хроническая почечная недостаточность при гемофильтрации, перитонеальном диализе и гемодиализе, Для компенсации потерь аминокислот во время и после диализа или гемофильтрации, Почечная недостаточность после политравмы, обширного хирургического вмешательства и сепсиса, Дополнение к низкобелковой диете пациентам с хронической почечной недостаточностью, Поддержка в период невозможности питания через ЖКТ, Поддержка белкового обмена, Быстрое и полное усвоение, Комплексный эффект",
  },
];

const SELLERS = [
  {
    id: 9,
    name: { firstName: "Насрулло", patronymic: "", lastName: "Акис" },
    dob: new Date("2011-02-04"),
    employmentPeriod: {
      status: "active",
      startDate: new Date("2026-04-04"),
      endDate: null,
    },
    location_id: 9,
    telegram_id: 15110678,
    phone: "+75550145827",
  },
  {
    id: 1,
    name: { firstName: "Иван", patronymic: "Сергеевич", lastName: "Петров" },
    dob: new Date("1990-04-12"),
    employmentPeriod: {
      status: "active",
      startDate: new Date("2012-06-01"),
      endDate: null,
    },
    location_id: 12,
    telegram_id: 83472910,
    phone: "+79154823910",
  },
  {
    id: 2,
    name: { firstName: "Анна", patronymic: "Сергеевна", lastName: "Иванова" },
    dob: new Date("1992-05-17"),
    employmentPeriod: {
      status: "active",
      startDate: new Date("2014-04-01"),
      endDate: null,
    },
    location_id: 11,
    telegram_id: 67584930,
    phone: "+79267405183",
  },
  {
    id: 3,
    name: {
      firstName: "Дмитрий",
      patronymic: "Александрович",
      lastName: "Иванов",
    },
    dob: new Date("1985-09-23"),
    employmentPeriod: {
      status: "active",
      startDate: new Date("2008-03-15"),
      endDate: null,
    },
    location_id: 14,
    telegram_id: 92837465,
    phone: "+75551846674",
  },
  {
    id: 4,
    name: {
      firstName: "Сергей",
      patronymic: "Николаевич",
      lastName: "Смирнов",
    },
    dob: new Date("1978-01-30"),
    employmentPeriod: {
      status: "active",
      startDate: new Date("2002-11-10"),
      endDate: null,
    },
    location_id: 10,
    telegram_id: 56473829,
    phone: "+79095529041",
  },
  {
    id: 5,
    name: {
      firstName: "Екатерина",
      patronymic: "Дмитриевна",
      lastName: "Кузнецова",
    },
    dob: new Date("1988-10-09"),
    employmentPeriod: {
      status: "active",
      startDate: new Date("2010-06-20"),
      endDate: null,
    },
    location_id: 13,
    telegram_id: 84736251,
    phone: "+79853047712",
  },
  {
    id: 6,
    name: {
      firstName: "Алексей",
      patronymic: "Дмитриевич",
      lastName: "Волков",
    },
    dob: new Date("1998-07-19"),
    employmentPeriod: {
      status: "non-active",
      startDate: new Date("2020-08-01"),
      endDate: new Date("2026-04-01"),
    },
    location_id: 15,
    telegram_id: 19283746,
    phone: "+79166632095",
  },
  {
    id: 7,
    name: { firstName: "Мария", patronymic: "Павловна", lastName: "Соколова" },
    dob: new Date("1995-02-25"),
    employmentPeriod: {
      status: "active",
      startDate: new Date("2017-03-10"),
      endDate: null,
    },
    location_id: 10,
    telegram_id: 73625184,
    phone: "+79254801936",
  },
  {
    id: 8,
    name: {
      firstName: "Анастасия",
      patronymic: "Игоревна",
      lastName: "Морозова",
    },
    dob: new Date("2006-07-14"),
    employmentPeriod: {
      status: "active",
      startDate: new Date("2025-05-20"),
      endDate: null,
    },
    location_id: 15,
    telegram_id: 91827364,
    phone: "+79161234567",
  },
];

const MANAGERS = [
  {
    name: {
      firstName: "Александр",
      patronymic: "Викторович",
      lastName: "Орлов",
    },
    dob: new Date("1980-06-14"),
    employmentPeriod: {
      status: "active",
      startDate: new Date("2003-09-01"),
      endDate: null,
    },
    location_id: 1,
    telegram_id: 91827364,
    phone: "+79163458271",
  },
  {
    name: { firstName: "Максим", patronymic: "Андреевич", lastName: "Федоров" },
    dob: new Date("1991-11-22"),
    employmentPeriod: {
      status: "active",
      startDate: new Date("2013-05-10"),
      endDate: null,
    },
    location_id: 1,
    telegram_id: 82736455,
    phone: "+79214587634",
  },
  {
    name: { firstName: "Ольга", patronymic: "Сергеевна", lastName: "Морозова" },
    dob: new Date("1987-03-08"),
    employmentPeriod: {
      status: "active",
      startDate: new Date("2009-04-15"),
      endDate: null,
    },
    location_id: 1,
    telegram_id: 73645582,
    phone: "+79031247856",
  },
  {
    name: {
      firstName: "Наталья",
      patronymic: "Дмитриевна",
      lastName: "Васильева",
    },
    dob: new Date("1993-07-19"),
    employmentPeriod: {
      status: "active",
      startDate: new Date("2015-08-01"),
      endDate: null,
    },
    location_id: 1,
    telegram_id: 64558291,
    phone: "+79852364190",
  },
  {
    name: { firstName: "Елена", patronymic: "Павловна", lastName: "Новикова" },
    dob: new Date("1985-12-02"),
    employmentPeriod: {
      status: "active",
      startDate: new Date("2007-02-20"),
      endDate: null,
    },
    location_id: 1,
    telegram_id: 55482917,
    phone: "+79316745028",
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
    name: "AKIS Pharma",
    pharmacyNumber: 9,
    addedAt: new Date("2026-04-11T09:12:00"),
    address: {
      city: "Душанбе",
      street: "Рудаки проспект",
      buildingNumber: "45",
      province: "",
      zipCode: "734001",
    },
    contact: {
      phone: "372123456",
      mobilePhone: "901234567",
      email: "info@dushanpharm.tj",
      fax: "372123457",
      website: "https://dushanpharm.tj",
    },
    management: [
      {
        role: "Менеджер",
        name: "Зарина Юсуфова",
        roomNumber: "201",
        phone: "372123458",
        mobilePhone: "901234568",
        email: "z.yusupova@akispharma.tj",
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
    name: "Аптека Здоровье+",
    pharmacyNumber: 10,
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
    pharmacyNumber: 11,
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
    pharmacyNumber: 12,
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
    pharmacyNumber: 13,
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
    pharmacyNumber: 14,
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
    pharmacyNumber: 15,
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
  PRODUCTS,
  PRODUCTS_NAMES,
  SELLERS,
  MANAGERS,
  ADMINS,
  PHARMACIES,
};
