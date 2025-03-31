export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  thumbnail: string;
  image?: string;
}

export const customElectronicProducts: Product[] = [
  {
    id: 10006,
    title: "Dell XPS 13 Laptop",
    price: 999.99,
    description:
      "The Dell XPS 13 is a premium ultraportable laptop featuring a sleek InfinityEdge display with minimal bezels, powered by a latest-generation Intel Core processor. Ideal for professionals and students seeking performance and portability in a compact 13-inch form factor, this laptop offers exceptional build quality, long battery life, and powerful computing capabilities for productivity and light creative work.",
    category: "laptops",
    thumbnail:
      "https://infotekph.com/wp-content/uploads/2022/03/dell-xps-2.jpg",
  },
  {
    id: 10007,
    title: "HP Pavilion Desktop Computer",
    price: 749.99,
    description:
      "The HP Pavilion Desktop is a robust home and office computing solution equipped with a powerful AMD Ryzen 7 processor and 16GB of RAM. Designed to handle multitasking, productivity applications, and moderate creative workloads, this desktop offers a perfect balance of performance and value. Its versatile configuration makes it suitable for home office, light gaming, and multimedia entertainment.",
    category: "computers",
    thumbnail:
      "https://png.pngtree.com/png-clipart/20240705/original/pngtree-a-white-and-black-computer-case-on-surface-png-image_15495939.png",
  },
  {
    id: 10008,
    title: "Synology DiskStation NAS Server",
    price: 499.99,
    description:
      "The Synology DiskStation is a comprehensive network-attached storage solution designed for home and small business users. Featuring 12 drive bays, this NAS provides extensive storage capacity, robust data protection, and advanced file sharing capabilities. Perfect for media storage, backup, remote access, and creating a personal cloud storage system with enterprise-grade reliability and performance.",
    category: "server",
    thumbnail:
      "https://tse1.mm.bing.net/th?id=OIP.Qxn5ZgzgUT7liyafysoMbwHaHa&pid=Api",
  },
  {
    id: 10009,
    title: "ASUS ROG Swift 27-inch Monitor",
    price: 699.99,
    description:
      "The ASUS ROG Swift is a high-performance 27-inch gaming monitor designed for serious gamers and esports enthusiasts. Featuring an ultra-fast 144Hz refresh rate and remarkable 1ms response time, this monitor delivers smooth, blur-free visuals. Its advanced display technology ensures crisp image quality, vibrant colors, and minimal input lag, making it ideal for competitive gaming and immersive multimedia experiences.",
    category: "monitor",
    thumbnail:
      "https://i.pcmag.com/imagery/reviews/02xvRbLbS2JKh63t2jGShQe-5..v1569472810.jpg",
  },
  {
    id: 10010,
    title: "Logitech MX Master 3 Mouse",
    price: 99.99,
    description:
      "The Logitech MX Master 3 is an advanced wireless mouse engineered for professional productivity and comfort. Its ergonomic design features customizable buttons, precision scroll wheels, and seamless multi-device connectivity. With intelligent software that enables cross-computer control and advanced tracking, this mouse is perfect for designers, programmers, and professionals seeking ultimate workflow efficiency.",
    category: "mouse",
    thumbnail:
      "https://tse4.mm.bing.net/th?id=OIP.eRbukzQIStCfW2MPS0BkFAHaDX&pid=Api",
  },
  {
    id: 10011,
    title: "Canon PIXMA Wireless Printer",
    price: 149.99,
    description:
      "The Canon PIXMA Wireless Printer is a versatile all-in-one solution for home and small office printing needs. Combining high-quality printing, efficient scanning, and convenient copying capabilities, this printer offers wireless connectivity for multiple devices. With compact design, user-friendly features, and reliable performance, it provides an excellent balance of functionality and affordability for everyday document and photo printing.",
    category: "printer",
    thumbnail:
      "https://asdi.ph/cdn/shop/products/image_ecd4ce88-073c-425e-bcc9-3cd15e191e0e.png?v=1641455576",
  },
  {
    id: 10012,
    title: "Anker USB-C Hub",
    price: 49.99,
    description:
      "The Anker USB-C Hub is a compact and powerful connectivity solution for modern laptops and tablets. Featuring a 4-in-1 design with HDMI output, USB 3.0 ports, and an SD card reader, this hub expands your device's versatility. Its portable form factor and robust build quality make it an essential accessory for professionals and students who need flexible, on-the-go connectivity.",
    category: "peripherals",
    thumbnail: "https://anker.ph/cdn/shop/products/A83520A2.jpg?v=1694231402",
  },

  {
    id: 10014,
    title: "MacBook Pro 16-inch",
    price: 2399.99,
    description:
      "The MacBook Pro 16-inch is a powerhouse laptop designed for professional creators, developers, and demanding users. Featuring the advanced M2 Pro chip and a stunning 16-inch Liquid Retina XDR display, this laptop delivers exceptional performance and breathtaking visual quality. With its robust build, long battery life, and unparalleled processing capabilities, it sets a new standard for portable workstations.",
    category: "laptops",
    thumbnail:
      "https://www.zdnet.com/a/img/2019/11/21/a2a18525-2b54-4aea-ae9c-0310d48fb3c6/macbook-pro-16-header.jpg",
  },
  {
    id: 10015,
    title: "Lenovo ThinkPad X1 Carbon",
    price: 1499.99,
    description:
      "The Lenovo ThinkPad X1 Carbon is an ultra-lightweight business laptop that combines elegance, durability, and high performance. With its slim 14-inch form factor, robust carbon fiber construction, and enterprise-grade security features, this laptop is the ultimate companion for mobile professionals. Powered by Intel technology, it offers exceptional battery life, crisp display, and reliable performance for demanding business environments.",
    category: "laptops",
    thumbnail:
      "https://p3-ofp.static.pub//fes/cms/2024/07/05/05dhzg0lrtq4i0d3wxqyjjakwmbmzr331426.png",
  },
  {
    id: 10016,
    title: "ASUS ROG Zephyrus G14",
    price: 1799.99,
    description:
      "The ASUS ROG Zephyrus G14 is a compact powerhouse gaming laptop that redefines portable gaming performance. Featuring an AMD Ryzen 9 processor and NVIDIA RTX graphics, this 14-inch laptop delivers exceptional gaming and creative capabilities in an incredibly lightweight design. With its innovative cooling system, stunning display, and impressive battery life, it's the perfect choice for gamers and content creators who demand high performance on the go.",
    category: "laptops",
    thumbnail:
      "https://dlcdnwebimgs.asus.com/gain/7583764C-92E3-413D-A5AD-4CB7D9713802/w1000/h732",
  },
  {
    id: 10017,
    title: "Apple Mac Studio",
    price: 1999.99,
    description:
      "The Apple Mac Studio is a revolutionary desktop workstation designed for creative professionals and power users. Powered by the cutting-edge M2 Max chip, this compact yet powerful computer delivers unprecedented performance for video editing, 3D rendering, music production, and complex computational tasks. Its innovative design, exceptional thermal management, and extensive connectivity options make it the ultimate solution for high-end creative workflows.",
    category: "computers",
    thumbnail:
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mac-studio-select-202306?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1684004521772",
  },
  {
    id: 10018,
    title: "Lenovo ThinkCentre M920",
    price: 1299.99,
    description:
      "The Lenovo ThinkCentre M920 is a compact business desktop that delivers enterprise-grade performance and reliability. Equipped with an Intel Core i7 processor, this small form factor computer is ideal for professional environments with limited space. Its robust security features, extensive connectivity options, and reliable performance make it perfect for small businesses, offices, and professional workstations requiring a dependable computing solution.",
    category: "computers",
    thumbnail:
      "https://p1-ofp.static.pub/medias/bWFzdGVyfHJvb3R8OTAwNjZ8aW1hZ2UvcG5nfGhmYy9oZTUvOTc3NTI5NzUyNzgzOC5wbmd8ZmE2MGE0ZmU4NjExZjEwNzY1ZmI5NGFkNTliNGNkNzkzODY4M2VlZGQ0ZTBlOTIwODhmMGU3Y2YyZjA5NThlMg/lenovo-desktop-thinkcentre-m920-sff-hero.png",
  },
  {
    id: 10019,
    title: "ASUS ProArt Station",
    price: 2499.99,
    description:
      "The ASUS ProArt Station is a high-performance desktop computer meticulously designed for creative professionals. With powerful components optimized for content creation, video editing, 3D rendering, and complex computational tasks, this workstation delivers exceptional performance. Its professional-grade components, advanced cooling system, and extensive customization options make it the ultimate solution for designers, video editors, and multimedia professionals.",
    category: "computers",
    thumbnail:
      "https://media.ldlc.com/r1600/ld/products/00/06/09/60/LD0006096064_0006130595.jpg",
  },
  {
    id: 10020,
    title: "HPE ProLiant DL380 Gen10",
    price: 3999.99,
    description:
      "The HPE ProLiant DL380 Gen10 is an enterprise-grade rack server designed for demanding data center and cloud computing environments. Featuring dual Intel Xeon processors, advanced security features, and exceptional scalability, this server provides robust performance for complex computational workloads. Its flexible architecture, high-density design, and comprehensive management tools make it an ideal solution for businesses requiring reliable and powerful server infrastructure.",
    category: "server",
    thumbnail: "https://assets.ext.hpe.com/is/image/hpedam/s00006498?$zoom$",
  },
  {
    id: 10021,
    title: "Dell PowerEdge R740",
    price: 4499.99,
    description:
      "The Dell PowerEdge R740 is a versatile 2U rack server engineered for enterprise-level computing and storage requirements. With advanced storage capabilities, powerful compute performance, and exceptional flexibility, this server is designed to meet the most demanding data center and cloud infrastructure needs. Its robust security features, comprehensive management tools, and high-performance architecture make it a critical solution for businesses seeking scalable and reliable server technology.",
    category: "server",
    thumbnail:
      "https://i.dell.com/is/image/DellContent/content/dam/images/products/servers/poweredge/r740/dellemc-per740-24x25-bezel-lcd-2-above-ff-bold-reflection.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=738&qlt=100,1&resMode=sharp2&size=738,402&chrss=full",
  },
  {
    id: 10022,
    title: "LG UltraFine 5K Display",
    price: 1299.99,
    description:
      "The LG UltraFine 5K Display is a professional-grade monitor designed for creative professionals who demand exceptional color accuracy and incredible detail. Featuring a stunning 27-inch 5K resolution screen with P3 wide color gamut, this monitor delivers breathtaking visual clarity for photographers, video editors, graphic designers, and content creators. Its precise color reproduction, sleek design, and advanced display technology set a new standard for professional displays.",
    category: "monitor",
    thumbnail:
      "https://www.lg.com/content/dam/channel/wcms/in/images/monitors/27md5kl-b_atr_eail_in_c/gallery/27MD5KL-B-DZ-01.jpg",
  },

  {
    id: 10024,
    title: "Logitech MX Keys Wireless Keyboard",
    price: 109.99,
    description:
      "The Logitech MX Keys Wireless Keyboard is a premium typing solution designed for professionals seeking comfort, precision, and seamless productivity. With its perfect stroke keys, backlit design, and multi-device connectivity, this keyboard offers an unparalleled typing experience. Intelligent features like automatic backlighting, cross-computer control, and ergonomic design make it the ultimate tool for writers, programmers, and professionals who spend hours at their computer.",
    category: "keyboards",
    thumbnail:
      "https://resource.logitech.com/content/dam/logitech/en/products/keyboards/mx-keys-for-business/gallery/mx-keys-business-keyboard-s-gallery-us-graphite-1.png",
  },
  {
    id: 10025,
    title: "Razer BlackWidow V3 Pro",
    price: 229.99,
    description:
      "The Razer BlackWidow V3 Pro is a high-performance mechanical gaming keyboard that delivers precision, durability, and immersive gaming experience. Featuring Razer Green Switches, wireless connectivity, and customizable RGB lighting, this keyboard is designed for competitive gamers who demand the ultimate control. Its robust build, programmable macros, and advanced gaming features make it the weapon of choice for serious esports enthusiasts and professional gamers.",
    category: "keyboards",
    thumbnail:
      "https://gameone.ph/media/catalog/product/cache/d378a0f20f83637cdb1392af8dc032a2/b/l/blackwidow-v3-pro-keyboard-2.jpg",
  },
  {
    id: 10026,
    title: "Razer DeathAdder V2 Pro",
    price: 129.99,
    description:
      "The Razer DeathAdder V2 Pro is a cutting-edge wireless gaming mouse that combines precision, performance, and ergonomic design. Featuring an advanced optical sensor, customizable buttons, and low-latency wireless technology, this mouse delivers exceptional tracking and responsiveness. Its comfortable shape, long battery life, and versatile connectivity make it the perfect companion for competitive gamers and esports professionals seeking the ultimate gaming peripheral.",
    category: "mouse",
    thumbnail:
      "https://assets2.razerzone.com/images/da10m/carousel/razer-death-adder-gallery-24.png",
  },
  {
    id: 10027,
    title: "Logitech G Pro X Superlight",
    price: 159.99,
    description:
      "The Logitech G Pro X Superlight is an ultra-lightweight wireless gaming mouse engineered for professional esports athletes and competitive gamers. Weighing just 63 grams, this mouse delivers exceptional precision, speed, and performance. Its advanced HERO sensor, customizable buttons, and ergonomic design provide the perfect balance of comfort and competitive advantage. Designed in collaboration with professional gamers, it represents the pinnacle of gaming mouse technology.",
    category: "mouse",
    thumbnail:
      "https://ecommerce.datablitz.com.ph/cdn/shop/files/gassss_800x.jpg?v=1707806989",
  },
  {
    id: 10028,
    title: "HP Color LaserJet Enterprise",
    price: 1299.99,
    description:
      "The HP Color LaserJet Enterprise is a high-volume professional printer designed for demanding business environments. With advanced color printing capabilities, robust security features, and high-speed output, this printer delivers exceptional print quality and reliability. Its comprehensive management tools, energy efficiency, and scalable design make it the ideal solution for large offices, print centers, and businesses requiring professional-grade color printing.",
    category: "printer",
    thumbnail:
      "https://www.wesellit.ph/content/images/thumbs/0004256_hp-color-laserjet-enterprise-m651n.jpeg",
  },
  {
    id: 10029,
    title: "Epson EcoTank ET-4760",
    price: 499.99,
    description:
      "The Epson EcoTank ET-4760 is a revolutionary all-in-one printer that transforms home and small office printing with its innovative supersized ink tank system. Offering tremendous cost savings, exceptionally high page yields, and versatile printing capabilities, this printer eliminates the need for frequent cartridge replacements. With wireless connectivity, automatic two-sided printing, and high-quality output, it provides an eco-friendly and economical printing solution.",
    category: "printer",
    thumbnail:
      "https://cdn11.bigcommerce.com/s-it8zotdre9/images/stencil/1280x1280/products/1428/1584/ET-4850_600__78518.1635814351.jpg?c=1",
  },
  {
    id: 10030,
    title: "CalDigit TS3 Plus Thunderbolt Dock",
    price: 249.99,
    description:
      "The CalDigit TS3 Plus Thunderbolt Dock is a comprehensive connectivity solution for modern professionals and creative users. Featuring 15 versatile ports including Thunderbolt 3, USB-A, DisplayPort, and SD card reader, this dock expands your laptop's capabilities with seamless connectivity. Its robust build, compact design, and high-performance power delivery make it an essential accessory for professionals seeking a single, powerful hub to connect all their devices.",
    category: "peripherals",
    thumbnail:
      "https://www.caldigit.com/wp-content/uploads/2019/11/TS3-Plus_Product-Photography-2.png",
  },
];

export default customElectronicProducts;
