// Automatic in-content internal linking.
//
// Scans an article's body HTML for key dental terms and turns the FIRST
// occurrence of each into a contextual link to that topic's main article.
// In-body contextual links carry strong SEO weight, and the anchor text
// tells search engines + AI exactly what the target page is about.
//
// Safety rules:
//  - never link an article to itself
//  - link each term at most ONCE per article (no spammy over-linking)
//  - never inject links inside headings (<h1>..<h4>) or inside existing <a> tags
//  - longest terms matched first (so "خيط الأسنان" wins over "الأسنان")

// term -> target article slug. Order doesn't matter; we sort by length at runtime.
// Keep targets to the strongest "cornerstone" article for each concept.
const LINK_MAP = [
  // gum disease
  { term: 'التهاب دواعم السن', slug: 'al-farq-bayna-iltihab-al-litha-wa-dawaim-al-sin' },
  { term: 'التهاب اللثة', slug: 'ma-huwa-iltihab-al-litha' },
  { term: 'أمراض اللثة', slug: 'ma-huwa-iltihab-al-litha' },
  { term: 'انحسار اللثة', slug: 'inhisar-al-litha' },
  { term: 'نزيف اللثة', slug: 'limadha-tanzif-lithati' },
  { term: 'رائحة الفم', slug: 'raihat-al-fam-wa-amrad-al-litha' },

  // decay
  { term: 'تسوّس الأسنان', slug: 'ma-huwa-tasawwus-al-asnan' },
  { term: 'التسوّس', slug: 'ma-huwa-tasawwus-al-asnan' },
  { term: 'الفلورايد', slug: 'dawr-al-fluraid-fil-wiqaya' },
  { term: 'حشو الأسنان', slug: 'hashw-al-asnan-al-marahil-wal-anwa' },
  { term: 'حشو', slug: 'hashw-al-asnan-al-marahil-wal-anwa' },

  // daily care
  { term: 'خيط الأسنان', slug: 'kayfa-astakhdim-khayt-al-asnan' },
  { term: 'غسول الفم', slug: 'ghasul-al-fam-hal-ahtajuh' },
  { term: 'معجون الأسنان', slug: 'kayfa-akhtar-majun-al-asnan' },
  { term: 'فرشاة الأسنان', slug: 'kayfa-akhtar-furshat-al-asnan' },

  // whitening / cosmetic
  { term: 'تبييض الأسنان', slug: 'tabyid-al-asnan-kayfa-yaml' },
  { term: 'التبييض', slug: 'tabyid-al-asnan-kayfa-yaml' },
  { term: 'القشور الخزفية', slug: 'al-qushur-al-khazafiyya-al-finir' },
  { term: 'الفينير', slug: 'al-qushur-al-khazafiyya-al-finir' },
  { term: 'اصفرار الأسنان', slug: 'asbab-isfirar-al-asnan' },

  // implants / restoration
  { term: 'زراعة الأسنان', slug: 'ziraat-al-asnan-ma-hiya' },
  { term: 'الجسور السنّية', slug: 'al-jusur-al-sinniyya' },
  { term: 'أطقم الأسنان', slug: 'atqim-al-asnan' },

  // children
  { term: 'تسنين', slug: 'mata-yabda-al-tasnin' },
  { term: 'الأسنان اللبنية', slug: 'al-asnan-al-labaniyya' },
  { term: 'تقويم الأسنان', slug: 'ma-huwa-taqwim-al-asnan' },

  // deeper concepts (added as the library grew) — longest/most-specific first
  { term: 'التقليح وكشط الجذور', slug: 'al-tanzif-al-amiq-taqlih-kasht' },
  { term: 'التنظيف العميق', slug: 'al-tanzif-al-amiq-taqlih-kasht' },
  { term: 'جيوب اللثة', slug: 'juyub-al-litha' },
  { term: 'خراج الأسنان', slug: 'khurraj-al-asnan-tawari' },
  { term: 'سدّ الشقوق', slug: 'sadd-al-shuqut-al-fissure' },
  { term: 'حساسية الأسنان', slug: 'hasasiyat-al-asnan' },
  { term: 'علاج العصب', slug: 'ilaj-al-asab' },
  { term: 'تيجان الأسنان', slug: 'tijan-al-asnan' },
  { term: 'التاج', slug: 'tijan-al-asnan' },
  { term: 'جفاف الفم', slug: 'jafaf-al-fam' },
  { term: 'ميكروبيوم الفم', slug: 'microbiome-al-fam' },
  { term: 'صرير الأسنان', slug: 'sarir-al-asnan-ind-al-atfal' },
  { term: 'ترقيع العظم', slug: 'tarqi-al-azm-qabl-al-ziraa' },
  { term: 'التهاب ما حول الزرعة', slug: 'iltihab-ma-hawl-al-ziraa' },

  // insights ("الجديد في طب الأسنان") — these point to /jadeed/ not /maqalat/.
  // Marking them type:'insight' lets articles link INTO the insight hubs,
  // which is exactly the link equity those pages were missing.
  { term: 'الذكاء الاصطناعي', slug: 'al-zakaa-al-istinaai-fi-tibb-al-asnan', type: 'insight' },
  { term: 'فلورايد الفضة', slug: 'fluorayd-al-fidda-li-tasawwus-al-atfal', type: 'insight' },
  { term: 'فلورايد الفضّة', slug: 'fluorayd-al-fidda-li-tasawwus-al-atfal', type: 'insight' },
  // ===== Batch added 2026-06-08: new high-intent articles + insights =====
  // longest/most-specific terms first so they win over generic ones
  { term: 'خلع ضرس العقل', slug: 'khala-dirs-al-aql' },
  { term: 'ضرس العقل', slug: 'khala-dirs-al-aql' },
  { term: 'السنخ الجاف', slug: 'khala-al-sin-al-taafi-wa-al-sinkh-al-jaf' },
  { term: 'علاج اللثة بالليزر', slug: 'ilaj-al-litha-bil-laser' },
  { term: 'رائحة الفم الكريهة', slug: 'rayihat-al-fam-al-mustamirra-asbab' },
  { term: 'الزراعة الفورية', slug: 'al-ziraa-al-fawriya-baad-al-khala' },
  { term: 'سنّ متخلخل', slug: 'al-sin-al-mutakharkhil-hal-yumkin-inqadhuh' },
  { term: 'تخلخل الأسنان', slug: 'al-sin-al-mutakharkhil-hal-yumkin-inqadhuh' },
  { term: 'الكلورهيكسيدين', slug: 'ghasul-al-klorhexidine-al-aman' },
  { term: 'النانو-هيدروكسي أباتيت', slug: 'maajun-al-nano-hydroxyapatite', type: 'insight' },
  { term: 'هيدروكسي أباتيت', slug: 'maajun-al-nano-hydroxyapatite', type: 'insight' },
  { term: 'الفرشاة الذكية', slug: 'furshat-al-asnan-al-zakiyya', type: 'insight' },
  // ===== Batch added 2026-06-08 (3rd batch): more high-intent articles + insights =====
  { term: 'التقويم الشفّاف', slug: 'al-taqwim-al-shaffaf-alainer' },
  { term: 'تقويم الكبار', slug: 'taqwim-al-kibar-al-shaffaf-am-al-madani' },
  { term: 'جير الأسنان', slug: 'al-jir-asnan-azalatuh' },
  { term: 'الجير', slug: 'al-jir-asnan-azalatuh' },
  { term: 'ترقيع اللثة', slug: 'tatim-al-litha-al-jirahi' },
  { term: 'تطعيم اللثة', slug: 'tatim-al-litha-al-jirahi' },
  { term: 'الأسنان الدائمة', slug: 'al-asnan-al-daima-al-atfal-mata-tazhar' },
  { term: 'مكمّلات الفلورايد', slug: 'mukammilat-al-fluraid-lil-atfal' },
  { term: 'صرير الأسنان عند الكبار', slug: 'sarir-al-asnan-al-kibar-al-wiqaya' },
  { term: 'الواقي الليلي', slug: 'sarir-al-asnan-al-kibar-al-wiqaya' },
  { term: 'السنّ المتشقّق', slug: 'al-sin-al-mutashaqqiq-alamat' },
  { term: 'سنّ متشقّق', slug: 'al-sin-al-mutashaqqiq-alamat' },
  { term: 'معجون الفحم', slug: 'fahm-tabyid-al-asnan-al-aman' },
  { term: 'السجائر الإلكترونية', slug: 'al-sajayir-al-iliktruniya-wa-sihat-al-fam', type: 'insight' },
  { term: 'الفيب', slug: 'al-sajayir-al-iliktruniya-wa-sihat-al-fam', type: 'insight' },
  // ===== Orthodontics pillar (added 2026-06-08) =====
  { term: 'التقويم المعدني', slug: 'al-taqwim-al-madani-al-taqlidi' },
  { term: 'التقويم الخزفي', slug: 'al-taqwim-al-khazafi' },
  { term: 'التقويم الداخلي', slug: 'al-taqwim-al-dakhili-al-lisani' },
  { term: 'التقويم اللساني', slug: 'al-taqwim-al-dakhili-al-lisani' },
  { term: 'المثبّت', slug: 'al-mathbit-al-ritiner-baad-al-taqwim' },
  { term: 'الريتينر', slug: 'al-mathbit-al-ritiner-baad-al-taqwim' },
  { term: 'تكلفة التقويم', slug: 'taklifat-taqwim-al-asnan' },
  { term: 'سوء الإطباق', slug: 'tashih-al-asnan-al-bariza-wal-adda' },
  { term: 'ازدحام الأسنان', slug: 'ilaj-tazahum-al-asnan-wal-faraghat' },
  // ===== Cosmetic dentistry batch (added 2026-06-09) =====
  { term: 'تجميل الابتسامة', slug: 'tajmil-al-ibtisama-khayarat' },
  { term: 'الربط التجميلي', slug: 'al-rabt-al-tajmili-bonding' },
  { term: 'البوندينغ', slug: 'al-rabt-al-tajmili-bonding' },
  { term: 'اللومينير', slug: 'al-luminir-al-qushur-al-raqiqa' },
  { term: 'نحت الأسنان', slug: 'naht-wa-iadat-tashkil-al-asnan' },
  { term: 'تجميل اللثة', slug: 'tajmil-al-litha-al-ibtisama-al-litawiyya' },
  { term: 'الابتسامة اللثوية', slug: 'tajmil-al-litha-al-ibtisama-al-litawiyya' },
  { term: 'زينة الأسنان', slug: 'zinat-al-asnan-wal-jawahir-al-aman' },
  // ===== Dental emergencies cluster (added 2026-06-09) =====
  { term: 'طوارئ الأسنان', slug: 'tawari-al-asnan-madha-taf3al' },
  { term: 'السن المخلوع', slug: 'al-sin-al-makhlu-isaaf-fawri' },
  { term: 'السن المقلوع', slug: 'al-sin-al-makhlu-isaaf-fawri' },
  { term: 'سن مكسور', slug: 'sin-maksur-isaaf-awwali' },
  { term: 'ألم أسنان شديد', slug: 'alam-asnan-shadid-mufaji-madha-taf3al' },
  // ===== New insights batch (added 2026-06-09) =====
  { term: 'ميكروبيوم الفم', slug: 'al-mikrobiom-al-famawi-abhath', type: 'insight' },
  { term: 'البروبيوتيك', slug: 'al-brobaytik-wa-sihat-al-fam-abhath', type: 'insight' },
  { term: 'لصق الفم', slug: 'lasq-al-fam-athna-al-nawm-al-rauj', type: 'insight' },
  // ===== New insights batch 2 (added 2026-06-09) =====
  { term: 'المضمضة بالزيت', slug: 'al-madmada-bil-zayt-oil-pulling', type: 'insight' },
  { term: 'طب الأسنان عن بعد', slug: 'tibb-al-asnan-an-bud-teledentistry', type: 'insight' },
  { term: 'الليزر في طب الأسنان', slug: 'tibb-al-asnan-bil-laizar-ayna-wasal', type: 'insight' },
  // ===== Cosmetic long-tail batch (added 2026-06-09) — tabyid-al-asnan =====
  { term: 'هل الفينير دائم', slug: 'hal-al-finir-daim-am-qabil-lil-izala' },
  { term: 'العناية بالفينير', slug: 'al-inaya-bil-finir-ala-al-mada-al-tawil' },
  { term: 'استبدال الفينير', slug: 'mata-yafshal-al-finir-wa-istibdaluh' },
  { term: 'الفينير للفراغات', slug: 'al-finir-lil-faraghat-am-al-izdiham' },
  { term: 'إصلاح سن أمامي مكسور', slug: 'islah-sin-amami-maksur-khayarat' },
  { term: 'الأسنان المتآكلة', slug: 'khayarat-al-asnan-al-mutaakila' },
  { term: 'تحسين الابتسامة دون تقويم', slug: 'tahsin-ibtisama-bidun-taqwim' },
  { term: 'مرشح للفينير', slug: 'hal-ana-murashshah-lil-finir' },
  { term: 'نحت اللثة', slug: 'naht-al-litha-al-tajmili-al-hudud' },
  { term: 'توقعات تجميل الأسنان', slug: 'tawaqquat-tajmil-al-asnan-al-nadam-al-shai' },
  { term: 'الفينير مقابل الربط', slug: 'al-finir-muqabil-al-bonding-ayyuhuma' },
  { term: 'تجميل الأسنان بعد التقويم', slug: 'tajmil-al-asnan-baad-taqwim' },
  { term: 'التصميم الرقمي للابتسامة', slug: 'al-tajmil-al-raqami-tasmim-al-ibtisama' },
  { term: 'احمرار اللثة بعد الفينير', slug: 'ihmirar-al-litha-baad-al-finir' },
  { term: 'الأسنان الصغيرة', slug: 'al-asnan-al-saghira-aw-mutafawita-al-hajm' },
  { term: 'تجميل الضرس الخلفي', slug: 'tajmil-al-dars-al-khalfi-hal-yahtaj' },
  { term: 'الفينير المتحرك', slug: 'al-finir-al-mutaharrik-snap-on' },
  { term: 'تبييض الأسنان للمراهقين', slug: 'tabyid-al-asnan-lil-murahiqin' },
  { term: 'حالات لا ينصح فيها بالفينير', slug: 'al-halat-allati-la-yunsah-fiha-bil-finir' },
  { term: 'الفرق بين التجميل والترميم', slug: 'al-farq-bayna-tajmil-wa-tarmim-al-asnan' },
  // ===== Orthodontics adult/aligner batch (added 2026-06-09) — taqwim-al-asnan =====
  { term: 'ساعات ارتداء التقويم الشفاف', slug: 'kam-saa-albas-al-alainer-yawmiyyan' },
  { term: 'تنظيف التقويم الشفاف', slug: 'tanzif-al-alainer-wal-inaya-bih' },
  { term: 'نقاط الارتكاز', slug: 'nuqat-al-irtikaz-attachments-fi-al-alainer' },
  { term: 'التقويم الشفاف مقابل الخزفي', slug: 'al-alainer-muqabil-al-taqwim-al-khazafi' },
  { term: 'التقويم والكلام', slug: 'hal-yuathir-al-taqwim-ala-al-kalam' },
  { term: 'التقويم في العمل', slug: 'al-taqwim-wa-ijtimaat-al-amal-wal-thiqa' },
  { term: 'التقويم بعد الأربعين', slug: 'al-taqwim-baad-sin-al-arbain' },
  { term: 'التقويم للكبار', slug: 'hal-fat-al-awan-lil-taqwim-lil-kibar' },
  { term: 'السفر مع التقويم الشفاف', slug: 'al-safar-maa-al-taqwim-al-shaffaf' },
  { term: 'ألم التقويم الشفاف', slug: 'alam-al-taqwim-al-shaffaf-kayfa-tudiruh' },
  { term: 'التقويم الشفاف وأمراض اللثة', slug: 'al-taqwim-al-shaffaf-wa-amrad-al-litha' },
  { term: 'فشل التقويم الشفاف', slug: 'al-iltizam-bi-al-alainer-asbab-al-fashal' },
  { term: 'التقويم الجزئي', slug: 'al-taqwim-al-juzii-li-tashih-basit' },
  { term: 'التقويم قبل الفينير', slug: 'al-taqwim-qabl-al-finir-aw-al-ziraa' },
  { term: 'التقويم الشفاف عن بعد', slug: 'al-taqwim-al-shaffaf-an-bud-mukhatir' },
  { term: 'خلع الأسنان للتقويم', slug: 'istinzal-al-asnan-iza-lazim-lil-taqwim' },
  { term: 'التقويم ومفصل الفك', slug: 'al-taqwim-wa-mushkilat-al-fak-tmj' },
  { term: 'أخصائي تقويم الأسنان', slug: 'istishara-akhsaai-taqwim-al-asnan' },
  { term: 'التقويم وتبييض الأسنان', slug: 'al-mushabik-al-shaffafa-wa-tabyid-al-asnan' },
  { term: 'روتين التقويم الشفاف', slug: 'yawm-fi-hayat-mustakhdim-al-taqwim-al-shaffaf' },
  // ===== Children's dentistry long-tail batch (added 2026-06-09) — asnan-al-atfal =====
  { term: 'تأخّر ظهور أسنان الطفل', slug: 'taajjul-zuhur-asnan-al-tifl-mata-yaqlaq' },
  { term: 'الفراغات بين أسنان الطفل', slug: 'asnan-al-tifl-al-mutabaida-faragh-tabii' },
  { term: 'بقع على أسنان الطفل', slug: 'buqa-bayda-aw-bunniyya-ala-asnan-al-tifl' },
  { term: 'سكّر أدوية الأطفال', slug: 'sukkar-al-adwiya-wa-tasawwus-al-atfal' },
  { term: 'الرضاعة الليلية والأسنان', slug: 'fitam-al-radaaa-al-layliyya-wal-asnan' },
  { term: 'العضّ أثناء التسنين', slug: 'al-tahabbub-wal-jaz-ind-al-atfal-al-rudaa' },
  { term: 'تيجان الأسنان اللبنية', slug: 'talqim-asnan-al-atfal-al-labaniyya-bil-tijan' },
  { term: 'خلع السن اللبني', slug: 'khala-sin-labani-lil-tifl-mata' },
  { term: 'الأسنان الزائدة أو الناقصة', slug: 'al-asnan-al-zaida-aw-al-naqisa-ind-al-atfal' },
  { term: 'حماية أسنان الأطفال في الرياضة', slug: 'al-riyada-wa-himayat-asnan-al-atfal' },
  { term: 'نمو الفك والأسنان', slug: 'nmuw-al-fak-wal-asnan-ind-al-atfal' },
  { term: 'أخصائي أسنان الأطفال', slug: 'mata-yastashir-al-walid-akhsai-asnan-al-atfal' },
  { term: 'ازدحام أسنان الطفل اللبنية', slug: 'al-asnan-al-labaniyya-multasiqa-aw-mutabaida' },
  { term: 'ترتيب سقوط الأسنان اللبنية', slug: 'tasaqut-asnan-al-tifl-bil-tartib-al-tabii' },
  { term: 'الوقاية من تسوّس الأطفال', slug: 'al-himaya-min-tasawwus-al-atfal-yawmiyyan' },
  { term: 'حساسية أسنان الطفل', slug: 'hassasiyat-asnan-al-tifl-asbab' },
  { term: 'الرضاعة بالزجاجة والأسنان', slug: 'al-radaaa-bil-zujaja-wa-sihat-asnan-al-tifl' },
  { term: 'متابعة أسنان الطفل', slug: 'ziyarat-al-mutabaa-li-asnan-al-tifl' },
  { term: 'تآكل أسنان الطفل الأمامية', slug: 'ihtikak-asnan-al-tifl-al-amamiyya' },
  { term: 'عادات الأكل المطوّلة للطفل', slug: 'adat-al-radaaa-wal-akl-al-tawila-lil-tifl' },
  // ===== Decay prevention/early-stage batch (added 2026-06-09) — tasawwus-al-asnan =====
  { term: 'البقع البيضاء على الأسنان', slug: 'buqa-bayda-ala-al-asnan-bidayat-tasawwus' },
  { term: 'مراحل تسوّس الأسنان', slug: 'marahil-tasawwus-al-asnan-bil-tafsil' },
  { term: 'كيف أعرف أن لديّ تسوّس', slug: 'kayfa-aerif-anna-ladayya-tasawwus' },
  { term: 'هل كل تسوّس يحتاج حشو', slug: 'hal-kull-tasawwus-yahtaj-hashw' },
  { term: 'اللعاب وحماية الأسنان', slug: 'al-luaab-wa-himayat-al-asnan-min-al-tasawwus' },
  { term: 'الزيليتول', slug: 'al-zilitol-wal-tasawwus' },
  { term: 'روتين مسائي للأسنان', slug: 'rutin-masai-li-wiqaya-min-al-tasawwus' },
  { term: 'التسوّس حول الحشوات', slug: 'al-tasawwus-hawl-al-hashwat-wal-tijan' },
  { term: 'الأكثر عرضة للتسوّس', slug: 'man-hum-al-aktar-urda-li-al-tasawwus' },
  { term: 'تكرار الوجبات الخفيفة', slug: 'tikrar-al-wajabat-al-khafifa-wal-tasawwus' },
  { term: 'المشروبات الحمضية والأسنان', slug: 'al-mashrubat-al-hamida-wa-bidayat-al-tasawwus' },
  { term: 'الوقاية من التسوّس مع التقويم', slug: 'wiqaya-min-al-tasawwus-maa-al-taqwim' },
  { term: 'الفلورايد الموضعي', slug: 'fluraid-al-tatbiq-al-iyadi-al-warnish' },
  { term: 'تسوّس الأسنان الأمامية', slug: 'tasawwus-al-asnan-al-amamiyya-wiqaya' },
  { term: 'غسول الفم والتسوّس', slug: 'ghasul-al-fam-wal-wiqaya-min-al-tasawwus' },
  { term: 'التسوّس المبكر دون ألم', slug: 'al-tasawwus-al-mubakkir-bidun-alam' },
  { term: 'كيف يتكوّن التسوّس', slug: 'kayfa-yatakawwan-al-tasawwus-khutuwa-bi-khutuwa' },
  { term: 'أهمية الفحص الدوري', slug: 'ahammiyat-al-fahs-al-dawri-fi-kashf-al-tasawwus' },
  { term: 'التسوّس ومرضى السكّري', slug: 'al-wiqaya-min-al-tasawwus-li-marda-al-sukkari' },
  { term: 'تسوّس الجذور', slug: 'al-tasawwus-tahta-al-litha-juzur-wiqaya' },
  // ===== Daily care specific-situations batch (added 2026-06-09) — al-inaya-al-yawmiyya =====
  { term: 'العناية بالأسنان أثناء السفر', slug: 'al-inaya-bil-asnan-athna-al-safar' },
  { term: 'العناية بالأسنان في العمل', slug: 'al-inaya-bil-asnan-fi-al-amal' },
  { term: 'العناية بالأسنان أثناء الحمل', slug: 'al-inaya-bil-asnan-athna-al-haml' },
  { term: 'العناية بالأسنان أثناء المرض', slug: 'al-inaya-bil-asnan-athna-al-marad' },
  { term: 'العناية بأسنان المراهقين', slug: 'al-inaya-bil-asnan-lil-murahiqin' },
  { term: 'العناية بأسنان كبار السن', slug: 'al-inaya-bil-asnan-li-kibar-al-sin' },
  { term: 'العناية بالأسنان بعد الخمسين', slug: 'al-inaya-bil-asnan-baad-al-khamsin' },
  { term: 'العناية بطقم الأسنان المتحرك', slug: 'al-inaya-bi-taqm-al-asnan-al-mutaharrik' },
  { term: 'العناية بالتيجان والجسور', slug: 'al-inaya-al-manziliyya-bil-tijan-wal-jusur' },
  { term: 'روتين الأسنان الحساسة', slug: 'al-inaya-bil-asnan-al-hassasa-rutin' },
  { term: 'العناية بالأسنان بعد التقيؤ', slug: 'al-inaya-bil-asnan-baad-al-taqayyu' },
  { term: 'روتين الليل أم الصباح', slug: 'rutin-al-layl-am-al-sabah-al-awlawiyya' },
  { term: 'بدائل تنظيف الأسنان', slug: 'madha-tafal-iza-lam-tatamakkan-min-al-tanzif' },
  { term: 'العناية بالأسنان أثناء الامتحانات', slug: 'al-inaya-bil-asnan-athna-al-imtihanat-wal-tawattur' },
  { term: 'العناية بالفم بعد خلع السن', slug: 'al-inaya-bil-asnan-baad-khala-al-sin' },
  { term: 'العناية بأسنان المدخنين', slug: 'al-inaya-bil-asnan-lil-mudakhinin' },
  { term: 'العناية بالأسنان في البرد', slug: 'al-inaya-bil-asnan-fi-al-taqs-al-bared' },
  { term: 'العناية بالأسنان للرياضيين', slug: 'al-inaya-bil-asnan-lil-riyadiyyin' },
  { term: 'العناية بالأسنان مع الأدوية المزمنة', slug: 'al-inaya-bil-asnan-maa-al-adwiya-al-muzmina' },
  { term: 'العناية بالمثبت ريتينر', slug: 'al-inaya-bil-mathbit-al-shaffaf-ritiner' },
  // ===== Gum disease early-stage/prevention batch (added 2026-06-09) — amrad-al-litha =====
  { term: 'هل نزيف اللثة طبيعي', slug: 'hal-nazif-al-litha-tabii-am-indhar' },
  { term: 'عكس التهاب اللثة المبكر', slug: 'hal-yumkin-aks-iltihab-al-litha-al-mubakkir' },
  { term: 'العلامات المبكرة لأمراض اللثة', slug: 'alamat-mubakkira-li-amrad-al-litha' },
  { term: 'شكل اللثة السليمة', slug: 'shakl-al-litha-al-salima-kayf-tabdu' },
  { term: 'اللثة الحساسة', slug: 'al-litha-al-mutahassisa-asbab-wa-rutin' },
  { term: 'تقنيات التفريش لصحة اللثة', slug: 'tiqniyat-tafrish-li-sihhat-al-litha' },
  { term: 'الخيط وصحة اللثة', slug: 'al-khayt-wa-sihhat-al-litha' },
  { term: 'أدوات التنظيف بين الأسنان', slug: 'adawat-tanzif-ma-bayna-al-asnan-lil-litha' },
  { term: 'الفرشاة الكهربائية وصحة اللثة', slug: 'al-furshat-al-kahrabaiyya-wa-sihhat-al-litha' },
  { term: 'غسول الفم لصحة اللثة', slug: 'ghasul-al-fam-li-sihhat-al-litha' },
  { term: 'اللثة وفيتامين سي', slug: 'al-litha-wa-fitamin-c-wal-taghdiya' },
  { term: 'التوتر وصحة اللثة', slug: 'al-tawattur-wa-sihhat-al-litha' },
  { term: 'التنفس من الفم وصحة اللثة', slug: 'al-tanaffus-al-famawi-wa-sihhat-al-litha' },
  { term: 'متى يستدعي نزيف اللثة الطبيب', slug: 'mata-yastadi-nazif-al-litha-ziyarat-al-tabib' },
  { term: 'العناية باللثة أثناء التقويم', slug: 'al-litha-wal-taqwim-al-inaya' },
  { term: 'العناية باللثة بعد الأربعين', slug: 'al-litha-baad-sin-al-arbain-wiqaya' },
  { term: 'روتين يومي للثة سليمة', slug: 'rutin-yawmi-li-litha-salima' },
  { term: 'البكتيريا والبلاك وأمراض اللثة', slug: 'al-baktiria-wal-balak-wa-bidayat-amrad-al-litha' },
  { term: 'هل التهاب اللثة معدٍ', slug: 'hal-iltihab-al-litha-muadi-lil-aila' },
  { term: 'فحص اللثة الدوري', slug: 'fahs-al-litha-al-dawri-wal-kashf-al-mubakkir' },
];

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Inject contextual internal links into article body HTML.
 * @param {string} htmlContent - the rendered article HTML
 * @param {string} currentSlug - slug of the article being rendered (no self-links)
 * @returns {string} HTML with contextual links added
 */
export function addContextualLinks(htmlContent, currentSlug) {
  if (!htmlContent) return htmlContent;

  // currentSlug may be a plain article slug ("foo") or an insight ("insight:foo").
  // Normalize so we never link a page to itself, whichever type it is.
  let curType = 'article';
  let curSlug = currentSlug;
  if (typeof currentSlug === 'string' && currentSlug.startsWith('insight:')) {
    curType = 'insight';
    curSlug = currentSlug.slice('insight:'.length);
  }

  // Sort terms longest-first so multi-word terms win over their substrings.
  const terms = [...LINK_MAP]
    .filter((t) => {
      const tType = t.type === 'insight' ? 'insight' : 'article';
      return !(tType === curType && t.slug === curSlug); // no self-links
    })
    .sort((a, b) => b.term.length - a.term.length);

  const linkedSlugs = new Set(); // each target article linked at most once
  const linkedTerms = new Set(); // each term linked at most once

  // Tokenize into tags vs text so we never inject inside a tag.
  // Also track whether we're inside a heading or an anchor to skip those.
  const tokens = htmlContent.split(/(<[^>]+>)/g);
  let skipDepth = 0; // >0 means inside <h*> or <a>

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    if (!tok) continue;

    if (tok.startsWith('<')) {
      const m = tok.match(/^<\s*(\/?)\s*([a-zA-Z0-9]+)/);
      if (m) {
        const closing = m[1] === '/';
        const tag = m[2].toLowerCase();
        const isSkip = tag === 'a' || /^h[1-4]$/.test(tag);
        if (isSkip) {
          if (closing) skipDepth = Math.max(0, skipDepth - 1);
          else if (!tok.endsWith('/>')) skipDepth++;
        }
      }
      continue; // never modify tags themselves
    }

    if (skipDepth > 0) continue; // inside heading or anchor — leave text alone

    // This is plain text outside tags — safe to inject links.
    let text = tok;
    for (const { term, slug, type } of terms) {
      if (linkedSlugs.has(slug) || linkedTerms.has(term)) continue;
      const re = new RegExp(escapeRegex(term));
      if (re.test(text)) {
        const base = type === 'insight' ? '/jadeed' : '/maqalat';
        text = text.replace(
          re,
          `<a href="${base}/${slug}/" class="text-teal underline decoration-teal-light underline-offset-4">${term}</a>`
        );
        linkedSlugs.add(slug);
        linkedTerms.add(term);
      }
    }
    tokens[i] = text;
  }

  return tokens.join('');
}
