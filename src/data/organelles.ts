export interface Organelle {
  id: string;
  nameBn: string;
  nameEn: string;
  descriptionBn: string[];
  descriptionEn: string[];
  presentIn: ('plant' | 'animal')[];
  functionBn: string[];
  functionEn: string[];
  color?: string;
}

export const ORGANELLES: Organelle[] = [
  {
    id: 'cell_wall',
    nameBn: 'কোষ প্রাচীর',
    nameEn: 'Cell Wall',
    descriptionBn: [
      'উদ্ভিদ কোষের সবচেয়ে বাইরের নির্জীব, শক্ত ও পুরু আবরণ।',
      'এটি প্রধানত সেলুলোজ, হেমিসেলুলোজ এবং পেকটিন দিয়ে তৈরি।',
      'প্রাণী কোষে কোষ প্রাচীর থাকে না।'
    ],
    descriptionEn: [
      'The outermost non-living, rigid, and thick covering of plant cells.',
      'Composed mainly of cellulose, hemicellulose, and pectin.',
      'Animal cells lack a cell wall.'
    ],
    presentIn: ['plant'],
    functionBn: [
      'কোষের নির্দিষ্ট আকৃতি প্রদান করে এবং অভ্যন্তরীণ অংশগুলোকে রক্ষা করে।',
      'প্রতিকূল পরিবেশে কোষকে শুকিয়ে যাওয়ার হাত থেকে রক্ষা করে।',
      'পার্শ্ববর্তী কোষগুলোর সাথে প্লাজমোডেসমাটা (Plasmodesmata)-এর মাধ্যমে যোগাযোগ রক্ষা করে।'
    ],
    functionEn: [
      'Provides a definite shape to the cell and protects internal parts.',
      'Protects the cell from drying out in adverse environments.',
      'Facilitates communication between adjacent cells via Plasmodesmata.'
    ],
    color: '#059669'
  },
  {
    id: 'cytoplasm',
    nameBn: 'সাইটোপ্লাজম',
    nameEn: 'Cytoplasm',
    descriptionBn: [
      'কোষঝিল্লির ভেতরে এবং নিউক্লিয়াসের বাইরে অবস্থিত অর্ধস্বচ্ছ, দানাদার ও জেলির মতো তরল পদার্থ।',
      'এর প্রধান উপাদান পানি, তবে এতে প্রোটিন, লিপিড এবং শর্করা দ্রবীভূত থাকে।',
      'সব ধরনের কোষীয় অঙ্গাণু এই সাইটোপ্লাজমের ভেতরেই ভাসমান অবস্থায় থাকে।'
    ],
    descriptionEn: [
      'Semi-transparent, granular, jelly-like fluid inside the cell membrane but outside the nucleus.',
      'Mainly composed of water, but contains dissolved proteins, lipids, and carbohydrates.',
      'All cell organelles are suspended within the cytoplasm.'
    ],
    presentIn: ['plant', 'animal'],
    functionBn: [
      'কোষের বিভিন্ন অঙ্গাণু ধারণ করে।',
      'কোষের অধিকাংশ বিপাকীয় কাজ (যেমন: গ্লাইকোলাইসিস) এখানে সম্পন্ন হয়।',
      'কোষের আকৃতি ঠিক রাখতে সাহায্য করে।'
    ],
    functionEn: [
      'Holds various cell organelles in place.',
      'Most metabolic activities (e.g., glycolysis) occur here.',
      'Helps maintain the cell\'s shape.'
    ],
    color: '#94a3b8'
  },
  {
    id: 'nucleus',
    nameBn: 'নিউক্লিয়াস',
    nameEn: 'Nucleus',
    descriptionBn: [
      'কোষের কেন্দ্রস্থলে অবস্থিত দ্বিস্তরী আবরণীযুক্ত, গোলাকার এবং সর্বাপেক্ষা ঘন অঙ্গাণু।',
      'এর প্রধান অংশগুলো হলো: নিউক্লিয়ার মেমব্রেন, নিউক্লিওপ্লাজম, নিউক্লিওলাস এবং ক্রোমাটিন তন্তু।',
      'স্তন্যপায়ী প্রাণীর পরিণত লোহিত রক্তকণিকায় নিউক্লিয়াস থাকে না।'
    ],
    descriptionEn: [
      'A double-membrane bound, spherical, and most dense organelle located at the center of the cell.',
      'Main parts include: Nuclear membrane, nucleoplasm, nucleolus, and chromatin fibers.',
      'Mature mammalian red blood cells lack a nucleus.'
    ],
    presentIn: ['plant', 'animal'],
    functionBn: [
      'কোষের সমস্ত বিপাকীয় এবং শারীরবৃত্তীয় কাজ নিয়ন্ত্রণ করে।',
      'ক্রোমাটিন তন্তুর মাধ্যমে বংশগতির বৈশিষ্ট্য (DNA) এক প্রজন্ম থেকে অন্য প্রজন্মে বহন করে।',
      'কোষ বিভাজনে সরাসরি ভূমিকা পালন করে।'
    ],
    functionEn: [
      'Controls all metabolic and physiological activities of the cell.',
      'Carries genetic information (DNA) across generations via chromatin fibers.',
      'Plays a direct role in cell division.'
    ],
    color: '#8b5cf6'
  },
  {
    id: 'rer',
    nameBn: 'এন্ডোপ্লাজমিক রেটিকুলাম',
    nameEn: 'Endoplasmic Reticulum',
    descriptionBn: [
      'এন্ডোপ্লাজমিক রেটিকুলামের যে অংশের বাইরের গায়ে রাইবোসোম (Ribosome) যুক্ত থাকে।',
      'রাইবোসোম থাকার কারণে একে অমসৃণ বা রাফ দেখায়।',
      'এটি সাধারণত নিউক্লিয়াসের কাছাকাছি অবস্থান করে।'
    ],
    descriptionEn: [
      'The part of the Endoplasmic Reticulum with ribosomes attached to its outer surface.',
      'Appears rough due to the presence of ribosomes.',
      'Usually located near the nucleus.'
    ],
    presentIn: ['plant', 'animal'],
    functionBn: [
      'রাইবোসোমগুলোর সাহায্যে প্রোটিন সংশ্লেষণ করে।',
      'তৈরিকৃত প্রোটিন গলজি বডিতে প্রেরণ করে।',
      'কোষের অভ্যন্তরীণ কাঠামো বা কঙ্কাল হিসেবে কাজ করে।'
    ],
    functionEn: [
      'Synthesizes proteins with the help of ribosomes.',
      'Transports synthesized proteins to the Golgi body.',
      'Acts as an internal framework or skeleton for the cell.'
    ],
    color: '#db2777'
  },
  {
    id: 'ser',
    nameBn: 'স্মুথ এন্ডোপ্লাজমিক রেটিকুলাম',
    nameEn: 'Smooth ER',
    descriptionBn: [
      'এন্ডোপ্লাজমিক জালিকার যে অংশের গায়ে রাইবোসোম যুক্ত থাকে না।',
      'রাইবোসোম না থাকায় এর পৃষ্ঠভাগ মসৃণ হয়।',
      'এটি মূলত লিপিড ও স্টেরয়েড উৎপাদনকারী কোষে বেশি দেখা যায়।'
    ],
    descriptionEn: [
      'The part of the Endoplasmic Reticulum without attached ribosomes.',
      'Has a smooth surface due to the absence of ribosomes.',
      'Predominantly found in cells producing lipids and steroids.'
    ],
    presentIn: ['plant', 'animal'],
    functionBn: [
      'লিপিড (চর্বি) এবং স্টেরয়েড হরমোন সংশ্লেষণ করে।',
      'কোষের বিষাক্ত পদার্থ এবং ওষুধ নিরাময়ে (Detoxification) সাহায্য করে।',
      'পেশিকোষে ক্যালসিয়াম আয়ন সঞ্চয় করে।'
    ],
    functionEn: [
      'Synthesizes lipids (fats) and steroid hormones.',
      'Helps in the detoxification of toxic substances and drugs.',
      'Stores calcium ions in muscle cells.'
    ],
    color: '#ec4899'
  },
  {
    id: 'mitochondria',
    nameBn: 'মাইটোকন্ড্রিয়া',
    nameEn: 'Mitochondrion',
    descriptionBn: [
      'দুই স্তরবিশিষ্ট আবরণী দ্বারা ঘেরা কোষের একটি গুরুত্বপূর্ণ অঙ্গাণু।',
      'এর ভেতরের স্তরটি ভাঁজ হয়ে থাকে, যাকে ক্রিস্টি (Cristae) বলা হয়।',
      'এদের নিজস্ব DNA এবং রাইবোসোম থাকে, ফলে এরা নিজেদের প্রোটিন নিজেরাই তৈরি করতে পারে।'
    ],
    descriptionEn: [
      'A vital double-membrane organelle of the cell.',
      'The inner membrane is folded into structures called cristae.',
      'Contains its own DNA and ribosomes, allowing it to synthesize its own proteins.'
    ],
    presentIn: ['plant', 'animal'],
    functionBn: [
      'শ্বসন প্রক্রিয়ার মাধ্যমে কোষের জন্য প্রয়োজনীয় শক্তি (ATP) উৎপাদন করে।',
      'শক্তি উৎপাদনের কারণে একে কোষের "পাওয়ার হাউস" (Power House) বলা হয়।',
      'কোষের ক্যালসিয়াম আয়নের ঘনত্ব নিয়ন্ত্রণ করে।'
    ],
    functionEn: [
      'Produces essential energy (ATP) for the cell through respiration.',
      'Known as the "Powerhouse" of the cell due to energy production.',
      'Regulates the concentration of calcium ions in the cell.'
    ],
    color: '#e8001d'
  },
  {
    id: 'chloroplast',
    nameBn: 'ক্লোরোপ্লাস্ট',
    nameEn: 'Chloroplast',
    descriptionBn: [
      'উদ্ভিদ কোষের সবুজ বর্ণের প্লাস্টিড যা পাতায় বেশি থাকে।',
      'এতে ক্লোরোফিল নামক সবুজ রঞ্জক থাকে, যা পাতার সবুজ রঙের জন্য দায়ী।',
      'এর ভেতরের চাকতির মতো অংশগুলোকে থাইলাকয়েড (Thylakoid) বলা হয়।'
    ],
    descriptionEn: [
      'Green-colored plastids found in plant cells, mostly in leaves.',
      'Contains a green pigment called chlorophyll, responsible for the green color of leaves.',
      'Contains disc-like structures called thylakoids.'
    ],
    presentIn: ['plant'],
    functionBn: [
      'সূর্যের আলো ব্যবহার করে সালোকসংশ্লেষণ প্রক্রিয়ায় শর্করা জাতীয় খাদ্য তৈরি করে।',
      'খাদ্য তৈরি করে বলে একে কোষের "রান্নাঘর" (Kitchen of the cell) বলা হয়।',
      'বায়ুমণ্ডল থেকে কার্বন ডাই অক্সাইড গ্রহণ করে অক্সিজেন ত্যাগ করতে সাহায্য করে।'
    ],
    functionEn: [
      'Produces carbohydrate food through photosynthesis using sunlight.',
      'Known as the "Kitchen" of the cell.',
      'Helps in absorbing carbon dioxide and releasing oxygen into the atmosphere.'
    ],
    color: '#10b981'
  },
  {
    id: 'vacuole',
    nameBn: 'কোষ গহব্বর',
    nameEn: 'Vacuole',
    descriptionBn: [
      'কোষের সাইটোপ্লাজমে অবস্থিত তরল পদার্থ পূর্ণ একটি বিশাল গহ্বর।',
      'উদ্ভিদ কোষে এটি অনেক বড় হয় এবং কোষের কেন্দ্র দখল করে থাকে।',
      'প্রাণী কোষে এটি সাধারণত থাকে না, থাকলেও খুব ছোট আকারের হয়।'
    ],
    descriptionEn: [
      'A large fluid-filled cavity located in the cytoplasm.',
      'In plant cells, it is very large and occupies the center of the cell.',
      'In animal cells, it is usually absent or very small.'
    ],
    presentIn: ['plant', 'animal'],
    functionBn: [
      'কোষরস (Cell sap) ধারণ করে এবং কোষের পানির চাপ (Turgor pressure) বজায় রাখে।',
      'অপ্রয়োজনীয় বর্জ্য পদার্থ এবং অতিরিক্ত পানি সঞ্চয় করে রাখে।',
      'কোষের পিএইচ (pH) ব্যালেন্স ঠিক রাখতে সাহায্য করে।'
    ],
    functionEn: [
      'Contains cell sap and maintains the water pressure (turgidity) of the cell.',
      'Stores unnecessary waste products and excess water.',
      'Helps maintain the pH balance of the cell.'
    ],
    color: '#3b82f6'
  },
  {
    id: 'golgi',
    nameBn: 'গলজি বডি',
    nameEn: 'Golgi Body',
    descriptionBn: [
      'নিউক্লিয়াসের কাছাকাছি অবস্থিত থলির মতো চ্যাপ্টা আকৃতির আবরণীযুক্ত অঙ্গাণু।',
      'ইতালীয় বিজ্ঞানী ক্যামিলো গলজি এর আবিষ্কারক।',
      'এগুলো স্তরে স্তরে সাজানো থাকে এবং এদের চারপাশে ছোট ছোট ভেসিকল দেখা যায়।'
    ],
    descriptionEn: [
      'A membrane-bound organelle of flattened sacs located near the nucleus.',
      'Discovered by Italian scientist Camillo Golgi.',
      'Arranged in layers with small vesicles around them.'
    ],
    presentIn: ['plant', 'animal'],
    functionBn: [
      'এন্ডোপ্লাজমিক জালিকা থেকে আসা প্রোটিন ও লিপিডকে প্যাকেজিং করে সঠিক গন্তব্যে পাঠায়।',
      'এজন্য একে কোষের "ট্রাফিক পুলিশ" বা "প্যাকেজিং সেন্টার" বলা হয়।',
      'কিছু এনজাইম এবং কার্বোহাইড্রেট নিঃসরণ করে।'
    ],
    functionEn: [
      'Packages proteins and lipids from the Endoplasmic Reticulum and sends them to their destinations.',
      'Known as the "Traffic Police" or "Packaging Center" of the cell.',
      'Secretes certain enzymes and carbohydrates.'
    ],
    color: '#f59e0b'
  },
  {
    id: 'lysosome',
    nameBn: 'লাইসোসোম',
    nameEn: 'Lysosome',
    descriptionBn: [
      'প্রাণী কোষে পাওয়া যায় এমন একটি গোলাকার, একক আবরণীযুক্ত ক্ষুদ্র থলি।',
      'এর ভেতরে প্রচুর পরিমাণে শক্তিশালী পরিপাককারী এনজাইম থাকে।',
      'শ্বেত রক্তকণিকায় এদের প্রচুর পরিমাণে দেখা যায়।'
    ],
    descriptionEn: [
      'A spherical, single-membrane bound small sac found in animal cells.',
      'Contains many powerful digestive enzymes.',
      'Abundantly found in white blood cells.'
    ],
    presentIn: ['animal'],
    functionBn: [
      'বাইরে থেকে আসা রোগ জীবাণু এবং ব্যাকটেরিয়াকে ধ্বংস করে (ফ্যাগোসাইটোসিস)।',
      'কোষের পুরনো এবং অকেজো অঙ্গাণুগুলোকে হজম করে ফেলে।',
      'তীব্র খাদ্যাভাবে এরা পুরো কোষটিকেই ধ্বংস করে দিতে পারে, তাই একে "আত্মঘাতী থলিকা" (Suicidal bag) বলা হয়।'
    ],
    functionEn: [
      'Destroys pathogens and bacteria from outside (phagocytosis).',
      'Digests old and useless cell organelles.',
      'Can destroy the entire cell during severe starvation, earning it the name "Suicidal Bag".'
    ],
    color: '#ef4444'
  }
];

export const ORGANELLE_MAP = new Map(ORGANELLES.map(o => [o.id, o]));
