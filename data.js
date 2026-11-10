/*
  أعمال ستارز ديزاين
  لإضافة عميل جديد: ضع صوره في assets/clients بالأسماء  <id>-1.jpg , <id>-2.jpg ...
  والريل باسم <id>-reel.mp4 مع صورة الغلاف <id>-reel.jpg ثم أضف سطراً هنا.
  featured: true  => يظهر له قسم كامل (دراسة حالة) تحت فهرس الأعمال.
*/
const CLIENTS = [
  {
    id: 'cheez', name: 'مطعم خلية Cheez', en: 'Khalia Cheez', cat: 'مطاعم', place: 'عمّان',
    services: ['إدارة الصفحات', 'تصاميم منشورات', 'ريلز', 'حملات تفاعلية'],
    lede: 'محتوى متكامل لمطعم خلية بالجبن ومناقيش: حملات تفاعلية مثل «بطاقة الكنز» و«تحدي النكهتين»، تصاميم منتجات بروح المكان، وريلز أسبوعية.',
    images: 8, reels: ['clients/cheez-reel', 'reels/reel-5'], featured: true
  },
  {
    id: 'essence', name: 'Essence of Beauty', en: 'Slazenger Active Sport', cat: 'عطور وعناية', place: 'الأردن',
    services: ['حملة إعلانية', 'مشاهد بالذكاء الاصطناعي', 'ريلز'],
    lede: 'حملة بصرية لعطر Slazenger Active Sport: مشاهد سينمائية بين الغابة والجليد والبركان، منشورات إعلانية، وسلسلة ريلز.',
    images: 6, reels: ['clients/essence-reel'], featured: true
  },
  {
    id: 'klicker', name: 'Klicker & MyFood', en: 'Pet Food', cat: 'أغذية الحيوانات الأليفة', place: 'الأردن',
    services: ['تصاميم ثنائية اللغة', 'نقاط البيع', 'ريلز'],
    lede: 'محتوى بالعربية والإنجليزية لعلامتي Klicker وMyFood: التعريف بالمنتجات، خرائط نقاط البيع، وريلز قصيرة.',
    images: 5, reels: ['clients/klicker-reel'], featured: true
  },
  {
    id: 'asal', name: 'مطعم خلية وعسل', en: 'Khalia & Honey', cat: 'مطاعم', place: 'عمّان، الجبيهة',
    services: ['تصاميم الافتتاح', 'منيو النكهات', 'ريلز'],
    lede: 'إطلاق مطعم خلية وعسل: إعلان الافتتاح، بطاقة لكل نكهة بأسلوب موحّد، وريل «من الفرن للعلبة».',
    images: 7, reels: ['clients/asal-reel'], featured: true
  },
  {
    id: 'khaleej', name: 'مطعم الخليج', en: 'Gulf Restaurant', cat: 'مطاعم', place: 'السلط',
    services: ['تصاميم منشورات', 'تصوير ميداني', 'ريلز'],
    lede: 'مطعم مندي وزرب في السلط: تصاميم أطباق جريئة بالأسود والأصفر، وريلز مصوّرة من داخل المطبخ.',
    images: 6, reels: ['clients/khaleej-reel'], featured: true
  },
  {
    id: 'ajouri', name: 'المتميزون للديكورات', en: 'Al Mutamayzoon', cat: 'مطابخ وديكور', place: 'عمّان، المستندة',
    services: ['محتوى توعوي', 'عروض موسمية', 'ريلز المشاريع'],
    lede: 'منشورات تشرح الفرق في المطابخ والألمنيوم، عروض رمضان ومسابقاته، وريلز للمشاريع المنفّذة.',
    images: 7, reels: ['clients/ajouri-reel'], featured: true
  },
  {
    id: 'prime', name: 'برايم للألمنيوم', en: 'Prime Aluminium', cat: 'مطابخ وألمنيوم', place: 'عمّان، ماركا',
    services: ['تصاميم منشورات', 'مناسبات وطنية', 'ريلز'],
    lede: 'محتوى بهوية الأسود والذهبي: عرض المطابخ المنفّذة، منشورات المناسبات، وريل تعريفي.',
    images: 5, reels: ['clients/prime-reel'], featured: true
  },
  {
    id: 'whitegold', name: 'مطابخ الذهب الأبيض', en: 'WG Kitchens', cat: 'مطابخ وأجهزة', place: 'عمّان',
    services: ['كتالوج منتجات', 'عروض الجمعة البيضاء', 'ريلز'],
    lede: 'كتالوج رقمي للبطاريات والغاز والأفران والشفاطات، بسعر واضح وزر طلب في كل تصميم.',
    images: 6, reels: ['clients/whitegold-reel'], featured: true
  },
  {
    id: 'fornelli', name: 'مطابخ فورنلي', en: 'Fornelli Kitchens', cat: 'مطابخ', place: 'عمّان',
    services: ['محتوى تعليمي', 'مناسبات', 'ريلز'],
    lede: 'منشورات تعلّم الجمهور أساسيات تصميم المطبخ — مثلث الحركة والتوزيع وارتفاع سطح العمل — إلى جانب المناسبات وصور المشاريع.',
    images: 5, reels: ['clients/fornelli-reel'], featured: true
  },
  {
    id: 'wood', name: 'Wood House', en: 'Wood Industries', cat: 'صناعات خشبية', place: 'عمّان',
    services: ['معالجة صور', 'هوية موحدة', 'ريلز'],
    lede: 'صور غرف النوم والصالات والمطابخ بمعالجة وهوية موحدة، وريلز تعرض التفاصيل.',
    images: 4, reels: ['clients/wood-reel'], featured: true
  },
  {
    id: 'nabe', name: 'نبع العز للمطابخ', en: 'Naba Al-Ezz Kitchens', cat: 'مطابخ', place: 'طبربور، أبو علندا',
    services: ['تصوير المشاريع', 'مناسبات', 'ريلز جولات'],
    lede: 'تصوير ومعالجة المطابخ المنفّذة بهوية موحّدة، منشورات المناسبات، وريلز جولات داخل المشاريع.',
    images: 5, reels: ['clients/nabe-reel'], featured: true
  },
  {
    id: 'uslub', name: 'الأسلوب الأفضل للمطابخ', en: "Kitchen's Best Style", cat: 'مطابخ', place: 'عمّان، الجاردنز',
    services: ['تصاميم منشورات', 'محتوى تفاعلي', 'ريلز'],
    lede: 'تصاميم تجمع صور المشاريع مع رسالة واضحة وزر استشارة، وفوازير رمضان، وريلز تعرض التفاصيل.',
    images: 6, reels: ['clients/uslub-reel'], featured: true
  },
  {
    id: 'elite', name: 'Elite Kitchens', en: 'Elite Kitchens', cat: 'مطابخ', place: 'عمّان، الجبيهة',
    services: ['تصاميم العروض', 'ريلز'],
    lede: 'تصاميم عروض المطابخ بالمقاسات والمواصفات والسعر، وريلز للمشاريع.',
    images: 2, reels: ['clients/elite-reel'], featured: true
  },
  {
    id: 'nursery', name: 'حضانة نواة المستقبل', en: 'Bloomy Kids', cat: 'تعليم وطفولة', place: 'عمّان',
    services: ['ريلز CGI', 'جلسات تصوير'], images: 0, reels: ['clients/nursery-reel']
  },
  {
    id: 'qimma', name: 'القمة للتوصيل', en: 'Al Qimma Logistics', cat: 'توصيل', place: 'الأردن',
    services: ['ريلز إعلانية', 'تصاميم'], images: 2,
    reels: ['clients/qimma-reel', 'reels/reel-1', 'reels/reel-2', 'reels/reel-3']
  },
  {
    id: 'tia', name: 'TIA Fashion', en: 'TIA Fashion', cat: 'أزياء', place: 'عمّان',
    services: ['ريل الافتتاح', 'تصوير'], images: 0, reels: ['clients/tia-reel']
  },
  {
    id: 'beitez', name: 'بيت العز', en: 'Beit Al Ezz', cat: 'أدوات منزلية', place: 'الأردن',
    services: ['ريلز', 'تصوير'], images: 0, reels: ['clients/beitez-reel']
  },
  {
    id: 'rukn', name: 'ركن الإبداع للمطابخ', en: 'Rukn Al Ibdaa', cat: 'مطابخ', place: 'عمّان',
    services: ['تصاميم', 'ريلز'], images: 1, reels: ['clients/rukn-reel']
  }
];
