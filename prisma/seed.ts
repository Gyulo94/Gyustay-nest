import { fakerKO as faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedUsers() {
  Array.from({ length: 10 }, (v, i) => i).forEach(async () => {
    const userData = {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      image: faker.image.avatar(),
      description: faker.lorem.paragraph(),
      password: faker.internet.password({ length: 10 }),
    };
    const response = await prisma.user.create({
      data: userData,
    });
    console.log(response);
  });
}

async function seedCategories() {
  const categories = [
    '전망좋은',
    '자연',
    '동굴',
    '캠핑',
    '방',
    '한옥',
    '해변',
    '국립공원',
    '인기',
    '수영장',
    '농장',
    '통나무집',
    '디자인',
    '스키',
    '호수',
    '키즈',
    '저택',
    '신규',
    '섬',
    '주택',
    '서핑',
    '골프장',
  ];

  categories.forEach(async (category) => {
    const response = await prisma.category.create({
      data: {
        name: category,
      },
    });
    console.log(response);
  });
}

async function seedFags() {
  Array.from({ length: 10 }, (v, i) => i).forEach(async () => {
    const faqData = {
      title: faker.lorem.words(),
      description: faker.lorem.paragraph(),
    };
    const response = await prisma.faq.create({
      data: faqData,
    });
    console.log(response);
  });
}

async function seedRooms() {
  const totalUsers = await prisma.user.findMany();
  const totalCategories = await prisma.category.findMany();
  if (totalUsers.length > 1 && totalCategories.length > 1) {
    for (let i = 0; i < 20; i++) {
      const randomUser =
        totalUsers[Math.floor(Math.random() * totalUsers.length)];
      const randomCategory =
        totalCategories[Math.floor(Math.random() * totalCategories.length)];
      const roomData = {
        title: faker.lorem.words(),
        lat: getRandomLatitude(),
        lng: getRandomLongitude(),
        address:
          faker.location.state() +
          faker.location.street() +
          faker.location.streetAddress({ useFullAddress: true }),
        description: faker.lorem.paragraph(),
        price: parseInt(
          faker.commerce.price({ min: 50000, max: 500000, dec: 0 }),
        ),
        bedroomDescription: faker.lorem.words(),
        freeCancel: faker.datatype.boolean(),
        selfCheckIn: faker.datatype.boolean(),
        officeSpace: faker.datatype.boolean(),
        hasMountainsView: faker.datatype.boolean(),
        hasShampoo: faker.datatype.boolean(),
        hasFreeLaundry: faker.datatype.boolean(),
        hasAirConditioner: faker.datatype.boolean(),
        hasWifi: faker.datatype.boolean(),
        hasBarbeque: faker.datatype.boolean(),
        hasFreeParking: faker.datatype.boolean(),
        images: {
          create: Array.from({ length: 3 }).map(() => ({
            url: faker.image.urlLoremFlickr({
              category: 'hotel',
              width: 500,
              height: 500,
            }),
          })),
        },
        categoryId: randomCategory.id,
        userId: randomUser.id,
      };
      const response = await prisma.room.create({
        data: roomData,
      });
      console.log(response);
    }
  }
}

//서울 위도/경도값 랜덤 생성 함수
function getRandomLatitude() {
  const minLatiude = 37.4316;
  const maxLatiude = 37.701;

  return faker.number
    .float({
      min: minLatiude,
      max: maxLatiude,
      fractionDigits: 6,
    })
    ?.toString();
}

function getRandomLongitude() {
  const minLongitude = 126.7963;
  const maxLongitude = 127.1839;

  return faker.number
    .float({
      min: minLongitude,
      max: maxLongitude,
      fractionDigits: 6,
    })
    ?.toString();
}

async function main() {
  // await seedUsers();
  // await seedCategories();
  // await seedRooms();
  await seedFags();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
