import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@pajajaran.digital" },
    update: {},
    create: {
      email: "admin@pajajaran.digital",
      passwordHash: adminPassword,
      name: "Administrator",
      role: "ADMIN",
    },
  });

  const userPassword = await bcrypt.hash("user123", 12);
  await prisma.user.upsert({
    where: { email: "user@pajajaran.digital" },
    update: {},
    create: {
      email: "user@pajajaran.digital",
      passwordHash: userPassword,
      name: "Pengguna Demo",
      role: "USER",
    },
  });

  const catSejarah = await prisma.category.upsert({
    where: { slug: "sejarah" },
    update: {},
    create: { name: "Sejarah", slug: "sejarah", description: "Artikel sejarah Kerajaan Sunda dan Pajajaran", color: "#102B20" },
  });
  const catTokoh = await prisma.category.upsert({
    where: { slug: "tokoh" },
    update: {},
    create: { name: "Tokoh", slug: "tokoh", description: "Profil raja dan tokoh penting", color: "#D5AD56" },
  });
  const catPrasasti = await prisma.category.upsert({
    where: { slug: "prasasti" },
    update: {},
    create: { name: "Prasasti", slug: "prasasti", description: "Prasasti dan inskripsi bersejarah", color: "#183B2B" },
  });
  const catBudaya = await prisma.category.upsert({
    where: { slug: "budaya" },
    update: {},
    create: { name: "Budaya", slug: "budaya", description: "Budaya dan tradisi Sunda", color: "#F0D28A" },
  });

  const tagSunda = await prisma.tag.upsert({ where: { slug: "kerajaan-sunda" }, update: {}, create: { name: "Kerajaan Sunda", slug: "kerajaan-sunda" } });
  const tagPajajaran = await prisma.tag.upsert({ where: { slug: "pajajaran" }, update: {}, create: { name: "Pajajaran", slug: "pajajaran" } });
  const tagPrasasti = await prisma.tag.upsert({ where: { slug: "prasasti" }, update: {}, create: { name: "Prasasti", slug: "prasasti" } });
  const tagBudaya = await prisma.tag.upsert({ where: { slug: "budaya-sunda" }, update: {}, create: { name: "Budaya Sunda", slug: "budaya-sunda" } });


  await prisma.article.upsert({
    where: { slug: "pengantar-kerajaan-sunda" },
    update: {},
    create: {
      title: "Pengantar Kerajaan Sunda",
      slug: "pengantar-kerajaan-sunda",
      excerpt: "Mengenal Kerajaan Sunda, salah satu kerajaan besar di Jawa Barat yang berdiri selama berabad-abad.",
      content: "# Pengantar Kerajaan Sunda\n\nKerajaan Sunda merupakan salah satu kerajaan besar yang pernah berdiri di wilayah Jawa Barat. Kerajaan ini memiliki sejarah panjang yang terbentang dari periode awal hingga jatuhnya ke tangan kekuatan Islam di akhir abad ke-16.\n\n## Asal-Usul\n\nInformasi mengenai asal-usul Kerajaan Sunda berasal dari berbagai sumber, termasuk prasasti-prasasti yang ditemukan di wilayah Jawa Barat.\n\n## Sumber Sejarah\n\nSumber sejarah utama untuk Kerajaan Sunda meliputi:\n- Prasasti Ciaruteun\n- Prasasti Batutulis\n- Prasasti Kawali\n- Naskah-naskah kuno\n\n## Catatan Verifikasi\n\nSebagian informasi mengenai Kerajaan Sunda masih memerlukan penelitian lebih lanjut. Beberapa fakta yang disajikan dalam ensiklopedia ini berdasarkan interpretasi sejarawan dan dapat diperdebatkan.\n\n*Informasi ini disusun berdasarkan sumber-sumber yang tersedia secara publik.*",
      status: "PUBLISHED",
      authorId: admin.id,
      categoryId: catSejarah.id,
      publishedAt: new Date(),
      tags: { create: [{ tagId: tagSunda.id }, { tagId: tagPajajaran.id }] },
    },
  });


  await prisma.article.upsert({
    where: { slug: "pakuan-pajajaran-ibu-kota" },
    update: {},
    create: {
      title: "Pakuan Pajajaran: Ibu Kota Kerajaan Sunda",
      slug: "pakuan-pajajaran-ibu-kota",
      excerpt: "Pakuan Pajajaran adalah ibu kota Kerajaan Sunda yang terkenal dalam sejarah dan tradisi Sunda.",
      content: "# Pakuan Pajajaran\n\nPakuan Pajajaran merupakan ibu kota dari Kerajaan Sunda pada periode tertentu. Lokasi ini memiliki makna penting dalam sejarah dan budaya Sunda.\n\n## Lokasi\n\nPakuan Pajajaran diyakini berada di wilayah yang sekarang dikenal sebagai Bogor. Namun, lokasi pasti dari ibu kota ini masih menjadi subjek penelitian.\n\n## Signifikansi\n\nPakuan Pajajaran dikenal dalam berbagai sumber sejarah dan tradisi lisan Sunda.\n\n## Status Penelitian\n\nLokasi dan karakteristik pasti dari Pakuan Pajajaran masih memerlukan penelitian lebih lanjut.",
      status: "PUBLISHED",
      authorId: admin.id,
      categoryId: catSejarah.id,
      publishedAt: new Date(),
      tags: { create: [{ tagId: tagPajajaran.id }] },
    },
  });


  const jayabhupati = await prisma.king.upsert({
    where: { slug: "sri-jayabhupati" },
    update: {},
    create: {
      name: "Sri Jayabhupati",
      title: "Maharaja",
      slug: "sri-jayabhupati",
      reignStart: "sekitar 952 Saka (1030 M)",
      reignEnd: "tidak diketahui",
      description: "Raja Kerajaan Sunda yang namanya tercantum dalam Prasasti Ciaruteun.",
      biography: "Sri Jayabhupati merupakan salah satu raja Kerajaan Sunda yang namanya ditemukan dalam prasasti. Detail mengenai pemerintahannya masih menjadi subjek penelitian.",
      verificationStatus: "INTERPRETED",
      sourceNote: "Prasasti Ciaruteun. Tanggal dan detail pemerintahan berdasarkan interpretasi sejarawan.",
    },
  });

  const siliwangi = await prisma.king.upsert({
    where: { slug: "prabu-siliwangi" },
    update: {},
    create: {
      name: "Prabu Siliwangi",
      title: "Prabu",
      slug: "prabu-siliwangi",
      description: "Figur raja yang sangat terkenal dalam tradisi dan legenda Sunda.",
      biography: "Prabu Siliwangi adalah figur yang sangat menonjol dalam tradisi lisan dan legenda Sunda. Keberadaan historisnya sebagai individu nyata masih diperdebatkan.",
      verificationStatus: "LEGEND",
      sourceNote: "Tradisi lisan dan legenda Sunda. Keberadaan historis perlu penelitian lebih lanjut.",
    },
  });


  await prisma.inscription.upsert({
    where: { slug: "prasasti-ciaruteun" },
    update: {},
    create: {
      name: "Prasasti Ciaruteun",
      slug: "prasasti-ciaruteun",
      location: "Ciaruteun, Bogor, Jawa Barat",
      discoveryLocation: "Ciaruteun, Bogor",
      dateEstimate: "sekitar abad ke-5 M (berdasarkan interpretasi)",
      script: "Pallawa",
      language: "Sanskerta",
      transliteration: "Transliterasi lengkap perlu verifikasi dari sumber akademik.",
      translation: "Terjemahan lengkap perlu verifikasi dari sumber akademik. Prasasti ini menyebutkan nama Sri Jayabhupati.",
      description: "Prasasti Ciaruteun adalah salah satu prasasti penting yang ditemukan di wilayah Bogor.",
      historicalContext: "Prasasti ini memberikan bukti tertulis mengenai keberadaan kerajaan di wilayah ini pada periode tertentu.",
      verificationStatus: "INTERPRETED",
      sourceNote: "Sumber: berbagai kajian akademik. Transliterasi dan terjemahan perlu verifikasi dari sumber primer.",
      categoryId: catPrasasti.id,
    },
  });

  await prisma.inscription.upsert({
    where: { slug: "prasasti-batutulis" },
    update: {},
    create: {
      name: "Prasasti Batutulis",
      slug: "prasasti-batutulis",
      location: "Bogor, Jawa Barat",
      discoveryLocation: "Bogor",
      dateEstimate: "sekitar abad ke-16 M (berdasarkan interpretasi)",
      script: "Sunda Kuno",
      language: "Sunda Kuno",
      transliteration: "Transliterasi lengkap perlu verifikasi dari sumber akademik.",
      translation: "Terjemahan lengkap perlu verifikasi dari sumber akademik.",
      description: "Prasasti Batutulis adalah prasasti yang ditemukan di Bogor. Prasasti ini menyebutkan nama-nama raja Sunda.",
      historicalContext: "Prasasti ini memberikan informasi mengenai silsilah raja-raja Sunda pada periode tertentu.",
      verificationStatus: "INTERPRETED",
      sourceNote: "Sumber: berbagai kajian akademik. Transliterasi dan terjemahan perlu verifikasi dari sumber primer.",
      categoryId: catPrasasti.id,
    },
  });

  await prisma.inscription.upsert({
    where: { slug: "prasasti-kawali" },
    update: {},
    create: {
      name: "Prasasti Kawali",
      slug: "prasasti-kawali",
      location: "Kawali, Ciamis, Jawa Barat",
      discoveryLocation: "Kawali, Ciamis",
      dateEstimate: "sekitar abad ke-14 M (berdasarkan interpretasi)",
      script: "Sunda Kuno",
      language: "Sunda Kuno",
      transliteration: "Transliterasi lengkap perlu verifikasi dari sumber akademik.",
      translation: "Terjemahan lengkap perlu verifikasi dari sumber akademik.",
      description: "Prasasti Kawali adalah prasasti yang ditemukan di Kawali, Ciamis. Prasasti ini dikaitkan dengan raja-raja Sunda.",
      historicalContext: "Prasasti ini memberikan informasi mengenai keberadaan kerajaan di wilayah timur Jawa Barat.",
      verificationStatus: "INTERPRETED",
      sourceNote: "Sumber: berbagai kajian akademik. Transliterasi dan terjemahan perlu verifikasi dari sumber primer.",
      categoryId: catPrasasti.id,
    },
  });

  await prisma.media.create({
    data: {
      title: "Ilustrasi Pakuan Pajajaran",
      url: "/images/batutulis.jpg",
      type: "IMAGE",
      altText: "Ilustrasi Pakuan Pajajaran (lokal)",
      caption: "Ilustrasi lokal. Bukan foto autentik.",
      credit: "Aset lokal",
      source: "apps/web/public/images",
      license: "Lokal",
      isIllustration: true,
    },
  });

  console.log("Seeding completed.");
  console.log("Admin: admin@pajajaran.digital / admin123");
  console.log("User: user@pajajaran.digital / user123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

