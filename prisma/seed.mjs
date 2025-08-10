import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.menuItem.count();
  if (count > 0) {
    console.log("Menu already seeded. Skip.");
    return;
  }

  await prisma.menuItem.createMany({
    data: [
      {
        name: "番茄意面",
        description: "自制番茄酱，罗勒与帕玛森芝士",
        price: 12.9,
        imageUrl:
          "https://images.pexels.com/photos/6287523/pexels-photo-6287523.jpeg?auto=compress&cs=tinysrgb&w=1200",
        available: true,
      },
      {
        name: "鸡胸沙拉",
        description: "低脂鸡胸，混合生菜与油醋汁",
        price: 10.5,
        imageUrl:
          "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200",
        available: true,
      },
      {
        name: "芝士牛肉汉堡",
        description: "手打牛肉饼，切达芝士与焦糖洋葱",
        price: 15.9,
        imageUrl:
          "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200",
        available: false,
      },
    ],
  });

  console.log("Seeded menu items ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

//要run： npx prisma db seed或者npm run db:seed
// 每次更改上面内容后就要run： npx prisma migrate reset
// 按提示选择 yes，它会 drop 库、重建表并自动运行 seed

// 如果想查看database：npx prisma studio
// 结果同postico2里面显示的database内容，如果没有下载postico2，就可以run上面的command查看数据库内容。

const adminEmail = "admin@demo.com";
const adminPass = "admin123";
const hashed = await bcrypt.hash(adminPass, 10);

await prisma.user.upsert({
  where: { email: adminEmail },
  update: { role: "admin", password: hashed },
  create: { email: adminEmail, role: "admin", password: hashed },
});
console.log("Admin 用户:", adminEmail, "密码:", adminPass);
