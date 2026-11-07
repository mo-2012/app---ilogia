(function () {
  'use strict';

  const config = window.ILOGIA_CONFIG || {};
  const supabaseSdk = window.supabase;
  const supabaseClient = supabaseSdk && config.supabaseUrl && config.supabasePublishableKey
    ? supabaseSdk.createClient(config.supabaseUrl, config.supabasePublishableKey, {
      auth: { persistSession: true, autoRefreshToken: false, detectSessionInUrl: false, flowType: 'pkce' }
    })
    : null;
  const supabaseErrors = {
    ar: {
      unavailable: 'تعذر تحميل مكتبة Supabase. تحقق من اتصال الإنترنت ثم أعد تحميل الصفحة.',
      notReady: 'إعدادات اتصال Supabase غير مكتملة. راجع public/config.js.'
    },
    en: {
      unavailable: 'Could not load the Supabase library. Check your internet connection and reload the page.',
      notReady: 'Supabase is not configured. Check public/config.js.'
    }
  };
  const STORAGE = 'ilogia-eco-session';
  const DEMO_KEY = 'ilogia-dashboard-demo';
  const app = document.getElementById('app');
  const localeKey = 'ilg.locale';
  const translations = {
    ar: {
      home: 'الرئيسية', services: 'الخدمات', notifications: 'التنبيهات', profile: 'ملفي', settings: 'الإعدادات',
      greetingMorning: 'صباح الخير', greetingEvening: 'مساء الخير', student: 'يا صديقي', demo: 'وضع العرض التجريبي — كل الأرقام هنا للتوضيح وليست بيانات طالب حقيقي.', exitDemo: 'الخروج من العرض',
      signIn: 'تسجيل الدخول', loginTitle: 'أهلًا بعودتك', loginSub: 'سجّل الدخول إلى حساب لوحة الطالب.', register: 'إنشاء حساب', registerTitle: 'حساب جديد', registerSub: 'أنشئ حسابًا للوحة الطالب.', forgot: 'نسيت كلمة المرور؟', forgotTitle: 'استعادة كلمة المرور', forgotSub: 'اكتب بريدك وسنرسل لك رابطًا لتعيين كلمة مرور جديدة.', resetTitle: 'تعيين كلمة مرور جديدة', email: 'البريد الإلكتروني', password: 'كلمة المرور', newPassword: 'كلمة المرور الجديدة', confirm: 'تأكيد كلمة المرور', fullName: 'الاسم الكامل', submitLogin: 'دخول', createAccount: 'إنشاء الحساب', continueGoogle: 'المتابعة باستخدام Google', or: 'أو', sendLink: 'إرسال الرابط', updatePassword: 'حفظ كلمة المرور', demoEnter: 'استعراض تجريبي بدون حساب', noAccount: 'ليس لديك حساب؟', hasAccount: 'لديك حساب بالفعل؟', backLogin: 'العودة لتسجيل الدخول', checkEmail: 'تحقق من بريدك', emailSent: 'إذا كان البريد مسجلًا فستصلك رسالة خلال دقائق.', registered: 'أرسلنا رابط تأكيد إلى بريدك. افتح الرابط ثم سجّل الدخول.', configMissing: 'خدمة تسجيل الدخول غير متاحة حاليًا. يمكنك استعراض اللوحة بالبيانات التجريبية.',
      goal: 'هدف اليوم', editGoal: 'تعديل الهدف', minutes: 'دقيقة', goalDone: 'حققت هدف اليوم', studyHours: 'ساعات المذاكرة', lessons: 'دروس مكتملة', activeDays: 'أيام نشاط', streak: 'أيام متتالية', of: 'من', studyMap: 'خريطة المذاكرة — آخر ١٢ أسبوعًا', less: 'أقل', more: 'أكثر', weekTotal: 'إجمالي المذاكرة', weekDays: 'أيام ذاكرت فيها', bestDay: 'أطول يوم', avgDay: 'متوسط يوم المذاكرة', curriculum: 'التقدّم في المنهج', curriculumSub: 'أكملت {p}٪ من دروس المنصة', recent: 'آخر الدروس المكتملة', recentEmpty: 'لم تُكمل أي درس بعد', recentEmptySub: 'ابدأ أول درس من الموقع الرئيسي وسيظهر هنا.', openLessons: 'افتح الدروس', ecosystem: 'منظومة iLogia', ecosystemSub: 'كل خدمة تطبيق مستقل بحسابك نفسه.', allServices: 'كل الخدمات', notices: 'تنبيهات', allNotices: 'عرض الكل', subscription: 'الاشتراك', noSubscription: 'بدون اشتراك', activeSubscription: 'اشتراك فعّال', pendingSubscription: 'اشتراك قيد المراجعة', rejectedSubscription: 'اشتراك مرفوض', expiredSubscription: 'اشتراك منتهٍ', daysLeft: 'متبقٍ {n} يوم', planDetails: 'تفاصيل خطتك وحالة اشتراكك.', servicesSub: 'استكشف الأدوات والخدمات المتاحة لك.',
      live: 'متاح', building: 'قيد التطوير', planned: 'قريبًا', open: 'فتح', all: 'الكل', search: 'ابحث عن خدمة', noServices: 'لا توجد خدمة مطابقة', servicesIntro: 'خدمات منظومة iLogia — أدواتك التعليمية في مكان واحد.', unread: 'غير مقروء', markAll: 'تحديد الكل كمقروء', markOne: 'تحديد كمقروء', noNotices: 'لا توجد إشعارات', noticesSub: 'سنخبرك هنا بحالة اشتراكك وتقدّمك.', allTab: 'الكل',
      setupNotice: 'أكمل إعداد حسابك', setupBody: 'اختر صفّك الدراسي حتى نعرض لك المحتوى المناسب.', pendingNotice: 'طلب اشتراكك قيد المراجعة', pendingBody: 'ستُفعّل الدروس المدفوعة فور موافقة الإدارة على الإيصال.', activeNotice: 'اشتراكك فعّال', activeBody: 'باقة {plan} — متبقٍ {n} يوم.', expiringNotice: 'اشتراكك ينتهي قريبًا', expiringBody: 'متبقٍ {n} يوم على انتهاء باقة {plan}.', rejectedNotice: 'تم رفض إيصال الاشتراك', rejectedBody: 'راجع بيانات الدفع وأعد رفع الإيصال من الموقع الرئيسي.', goalNotice: 'أحسنت، حققت هدف اليوم', goalBody: 'ذاكرت {m} دقيقة اليوم.', streakNotice: 'سلسلة {n} أيام متتالية', streakBody: 'استمر يوميًا حتى لا تنقطع السلسلة.',
      name: 'الاسم الكامل', grade: 'الصف الدراسي', role: 'نوع الحساب', memberSince: 'عضو منذ', edit: 'تعديل البيانات', save: 'حفظ', cancel: 'إلغاء', chooseGrade: 'اختر الصف', emailNote: 'لتغيير البريد تواصل مع الدعم.', saved: 'تم حفظ بياناتك', studentRole: 'طالب', teacherRole: 'معلّم', adminRole: 'مسؤول المنصة', demoNoSave: 'الحفظ غير متاح في وضع العرض التجريبي.',
      language: 'اللغة', languageHelp: 'لغة واجهة لوحة الطالب.', digits: 'شكل الأرقام', arabDigits: 'هندية (١٢٣)', latinDigits: 'عربية (123)', dailyGoal: 'هدف المذاكرة اليومي', goalHelp: 'بالدقائق، يُحفظ على هذا الجهاز.', session: 'الجلسة', sessionHelp: 'تسجيل الخروج من هذا الجهاز.', logout: 'تسجيل الخروج', savedSettings: 'تم حفظ الإعدادات',
      errorLoad: 'تعذّر تحميل بياناتك', errorBody: 'تحقّق من اتصالك بالإنترنت ثم حاول مرة أخرى.', retry: 'إعادة المحاولة', errorGeneric: 'حدث خطأ. حاول مرة أخرى.', emailInvalid: 'اكتب بريدًا إلكترونيًا صحيحًا.', required: 'هذا الحقل مطلوب.', passwordShort: 'كلمة المرور ٨ أحرف على الأقل.', passwordMatch: 'كلمتا المرور غير متطابقتين.', nameInvalid: 'اكتب اسمك الكامل (٣ أحرف على الأقل).', gradeInvalid: 'اختر صفّك الدراسي.', loginError: 'تعذر تسجيل الدخول. تحقق من البريد وكلمة المرور.', notFound: 'الصفحة غير موجودة', goHome: 'العودة للرئيسية', minutesUnit: 'دقيقة', hoursUnit: 'ساعة', daysUnit: 'يوم', languageButton: 'English'
    },
    en: {
      home: 'Home', services: 'Services', notifications: 'Alerts', profile: 'Profile', settings: 'Settings',
      greetingMorning: 'Good morning', greetingEvening: 'Good evening', student: 'friend', demo: 'Demo mode — every number is sample data, not a real student’s data.', exitDemo: 'Exit demo',
      signIn: 'Sign in', loginTitle: 'Welcome back', loginSub: 'Sign in to your student dashboard account.', register: 'Create account', registerTitle: 'New account', registerSub: 'Create an account for the student dashboard.', forgot: 'Forgot password?', forgotTitle: 'Reset password', forgotSub: 'Enter your email and we’ll send a reset link.', resetTitle: 'Choose a new password', email: 'Email', password: 'Password', newPassword: 'New password', confirm: 'Confirm password', fullName: 'Full name', submitLogin: 'Sign in', createAccount: 'Create account', continueGoogle: 'Continue with Google', or: 'or', sendLink: 'Send link', updatePassword: 'Save password', demoEnter: 'Explore the demo without an account', noAccount: 'No account yet?', hasAccount: 'Already have an account?', backLogin: 'Back to sign in', checkEmail: 'Check your email', emailSent: 'If the email is registered, a message will arrive in a few minutes.', registered: 'We sent a confirmation link. Open it, then sign in.', configMissing: 'Sign-in is unavailable right now. You can explore the sample dashboard.',
      goal: 'Today’s goal', editGoal: 'Edit goal', minutes: 'min', goalDone: 'Goal reached today', studyHours: 'Study hours', lessons: 'Lessons completed', activeDays: 'Active days', streak: 'Day streak', of: 'of', studyMap: 'Study map — last 12 weeks', less: 'Less', more: 'More', weekTotal: 'Total study', weekDays: 'Days studied', bestDay: 'Longest day', avgDay: 'Average study day', curriculum: 'Curriculum progress', curriculumSub: 'You completed {p}% of platform lessons', recent: 'Recently completed lessons', recentEmpty: 'No lessons completed yet', recentEmptySub: 'Start a lesson on the main site and it will appear here.', openLessons: 'Open lessons', ecosystem: 'The iLogia ecosystem', ecosystemSub: 'Each service is its own app, using the same account.', allServices: 'All services', notices: 'Notices', allNotices: 'See all', subscription: 'Subscription', noSubscription: 'No subscription', activeSubscription: 'Active subscription', pendingSubscription: 'Subscription under review', rejectedSubscription: 'Subscription rejected', expiredSubscription: 'Subscription expired', daysLeft: '{n} days left', planDetails: 'Your plan details and subscription status.', servicesSub: 'Explore the tools and services available to you.',
      live: 'Live', building: 'In progress', planned: 'Coming soon', open: 'Open', all: 'All', search: 'Search services', noServices: 'No matching service', servicesIntro: 'iLogia ecosystem services — your learning tools in one place.', unread: 'Unread', markAll: 'Mark all as read', markOne: 'Mark as read', noNotices: 'No notifications', noticesSub: 'Subscription and progress updates will appear here.', allTab: 'All',
      setupNotice: 'Finish setting up your account', setupBody: 'Choose your grade so we can show the right content.', pendingNotice: 'Your subscription is under review', pendingBody: 'Paid lessons unlock once an admin approves your receipt.', activeNotice: 'Your subscription is active', activeBody: '{plan} plan — {n} days left.', expiringNotice: 'Your subscription ends soon', expiringBody: '{n} days left on the {plan} plan.', rejectedNotice: 'Your receipt was rejected', rejectedBody: 'Check the payment details and re-upload the receipt on the main site.', goalNotice: 'Great — daily goal reached', goalBody: 'You studied {m} minutes today.', streakNotice: '{n}-day streak', streakBody: 'Study every day to keep it going.',
      name: 'Full name', grade: 'Grade', role: 'Account type', memberSince: 'Member since', edit: 'Edit details', save: 'Save', cancel: 'Cancel', chooseGrade: 'Choose grade', emailNote: 'Contact support to change your email.', saved: 'Your details were saved', studentRole: 'Student', teacherRole: 'Teacher', adminRole: 'Platform admin', demoNoSave: 'Saving is disabled in demo mode.',
      language: 'Language', languageHelp: 'Dashboard interface language.', digits: 'Digits', arabDigits: 'Eastern (١٢٣)', latinDigits: 'Western (123)', dailyGoal: 'Daily study goal', goalHelp: 'In minutes, saved on this device.', session: 'Session', sessionHelp: 'Sign out on this device.', logout: 'Sign out', savedSettings: 'Settings saved',
      errorLoad: 'Couldn’t load your data', errorBody: 'Check your connection and try again.', retry: 'Try again', errorGeneric: 'Something went wrong. Try again.', emailInvalid: 'Enter a valid email.', required: 'This field is required.', passwordShort: 'Password must be at least 8 characters.', passwordMatch: 'Passwords do not match.', nameInvalid: 'Enter your full name (at least 3 characters).', gradeInvalid: 'Choose your grade.', loginError: 'Could not sign in. Check your email and password.', notFound: 'Page not found', goHome: 'Back to home', minutesUnit: 'min', hoursUnit: 'hrs', daysUnit: 'days', languageButton: 'العربية'
    }
  };
  const services = [
    { id: 'app', ar: 'لوحة الطالب', en: 'Student Dashboard', descAr: 'تقدّمك وإشعاراتك وحسابك في مكان واحد.', descEn: 'Your progress, notices and account in one place.', domain: 'app.ilogia-eg.com', state: 'live', icon: '⌂' },
    { id: 'exams', ar: 'الاختبارات', en: 'Exams', descAr: 'اختبارات موقوتة مع مراجعة الإجابات.', descEn: 'Timed exams with answer review.', domain: 'exams.ilogia-eg.com', state: 'live', icon: '✓' },
    { id: 'cards', ar: 'البطاقات التعليمية', en: 'Flashcards', descAr: 'مراجعة متباعدة ببطاقات سؤال وجواب.', descEn: 'Spaced review with question and answer cards.', domain: 'cards.ilogia-eg.com', state: 'live', icon: '▤' },
    { id: 'planner', ar: 'مخطط المذاكرة', en: 'Study Planner', descAr: 'جدول يومي وأسبوعي ومهام ومواعيد.', descEn: 'Daily and weekly plans, tasks and deadlines.', domain: 'planner.ilogia-eg.com', state: 'live', icon: '▦' },
    { id: 'library', ar: 'المكتبة التعليمية', en: 'Learning Library', descAr: 'مذكرات وملفات ودروس حسب الصف والمادة.', descEn: 'Notes, files and lessons by grade and subject.', domain: 'library.ilogia-eg.com', state: 'building', icon: '▥' },
    { id: 'arena', ar: 'ساحة التحدي', en: 'Learning Arena', descAr: 'تحديات ونقاط ومستويات وإنجازات.', descEn: 'Challenges, points, levels and achievements.', domain: 'arena.ilogia-eg.com', state: 'building', icon: '◇' },
    { id: 'ai', ar: 'المساعد الذكي', en: 'AI Assistant', descAr: 'شرح وتلخيص وأسئلة تدريبية بالعربية.', descEn: 'Explanations, summaries and practice questions.', domain: 'ai.ilogia-eg.com', state: 'live', icon: '✳' },
    { id: 'verify', ar: 'التحقق من الشهادات', en: 'Certificate Verification', descAr: 'تحقّق علني من صحة شهادات iLogia.', descEn: 'Public verification of iLogia certificates.', domain: 'verify.ilogia-eg.com', state: 'live', icon: '◇' }
  ];
  const publicCopy = {
    ar: {
      navHome: 'الرئيسية', navAbout: 'عن iLogia', navServices: 'الخدمات', navContact: 'تواصل معنا',
      signIn: 'تسجيل الدخول', getStarted: 'ابدأ الآن', heroEyebrow: 'تعلّم أذكى، خطوة بخطوة',
      heroTitle: 'كل أدوات تعلّمك، في مكان واحد.', heroBody: 'منصة تعليمية تساعدك على تنظيم مذاكرتك، متابعة تقدمك، والتدرّب بثقة.',
      exploreServices: 'استكشف الخدمات', learnMore: 'اكتشف iLogia', featureTitle: 'تجربة تعليمية متكاملة',
      featureBody: 'أدوات عملية تساعدك على التعلّم والمراجعة ومتابعة أهدافك الدراسية.',
      aboutTitle: 'عن iLogia', aboutBody: 'iLogia منظومة من الأدوات التعليمية الرقمية المصممة لدعم رحلتك الدراسية ومساعدتك على التعلّم باستمرار.',
      aboutPointOne: 'تابع تقدمك الدراسي في لوحة واحدة.', aboutPointTwo: 'نظّم وقتك وخطط جلسات مذاكرتك.', aboutPointThree: 'تدرّب وراجع باستخدام أدوات تعليمية متنوعة.',
      servicesTitle: 'خدمات iLogia', servicesBody: 'اكتشف الأدوات المتاحة الآن والخدمات التي نعمل على تطويرها.',
      contactTitle: 'ابدأ رحلتك مع iLogia', contactBody: 'سجّل الدخول إلى لوحة الطالب أو تواصل معنا عبر الموقع الرئيسي.',
      contactButton: 'زيارة موقع iLogia', footer: 'منظومة تعليمية تساعدك على التعلّم كل يوم.',
      available: 'متاح الآن', comingSoon: 'قريبًا', stepsTitle: 'ابدأ في ثلاث خطوات',
      stepOne: 'أنشئ حسابك أو سجّل الدخول.', stepTwo: 'اختر الأداة التي تناسب هدفك.', stepThree: 'تابع تقدّمك وواصل التعلّم.',
      dashboardLabel: 'لوحة الطالب'
    },
    en: {
      navHome: 'Home', navAbout: 'About', navServices: 'Services', navContact: 'Contact',
      signIn: 'Sign in', getStarted: 'Get started', heroEyebrow: 'Learn smarter, one step at a time',
      heroTitle: 'Everything you need to learn, in one place.', heroBody: 'A learning platform to help you organize your study, track your progress and practice with confidence.',
      exploreServices: 'Explore services', learnMore: 'Discover iLogia', featureTitle: 'A connected learning experience',
      featureBody: 'Practical tools to help you learn, review and stay on track with your study goals.',
      aboutTitle: 'About iLogia', aboutBody: 'iLogia is a collection of digital learning tools designed to support your studies and help you keep learning.',
      aboutPointOne: 'Track your study progress in one dashboard.', aboutPointTwo: 'Organize your time and plan study sessions.', aboutPointThree: 'Practice and review with a range of learning tools.',
      servicesTitle: 'iLogia services', servicesBody: 'Explore the tools available now and the services we are building.',
      contactTitle: 'Start learning with iLogia', contactBody: 'Sign in to your student dashboard or reach us through the main website.',
      contactButton: 'Visit the iLogia website', footer: 'A learning ecosystem to help you learn every day.',
      available: 'Available now', comingSoon: 'Coming soon', stepsTitle: 'Get started in three steps',
      stepOne: 'Create an account or sign in.', stepTwo: 'Choose the tool that fits your goal.', stepThree: 'Track your progress and keep learning.',
      dashboardLabel: 'Student dashboard'
    }
  };

  let locale = localStorage.getItem(localeKey) === 'en' ? 'en' : 'ar';
  let session = readSession();
  let dashboard = null;
  let profile = null;
  let demo = sessionStorage.getItem(DEMO_KEY) === '1';
  let pageBusy = false;
  let toastTimer;
  let noticesTab = 'all';
  let serviceTab = 'all';
  let serviceQuery = '';
  let editingProfile = false;

  function t(key, vars) {
    let value = translations[locale][key] || key;
    Object.keys(vars || {}).forEach((name) => { value = value.replaceAll('{' + name + '}', String(vars[name])); });
    return value;
  }
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  }
  function number(value) {
    return new Intl.NumberFormat(locale === 'ar' && localStorage.getItem('ilg.digits') !== 'latn' ? 'ar-EG' : 'en-US', { maximumFractionDigits: 1 }).format(value);
  }
  function date(value, options) {
    return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-GB', Object.assign({ timeZone: 'Africa/Cairo' }, options || {})).format(value);
  }
  function readSession() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE) || 'null');
      const restored = saved && saved.session ? saved.session : saved;
      if (!restored || !restored.access_token) return null;
      if (restored !== saved) localStorage.setItem(STORAGE, JSON.stringify(restored));
      return restored;
    } catch {
      return null;
    }
  }
  function saveSession(value) {
    session = value;
    if (value) localStorage.setItem(STORAGE, JSON.stringify(value));
    else localStorage.removeItem(STORAGE);
  }
  function unwrap(result) {
    if (result.error) {
      if (result.error.status) result.error.status = Number(result.error.status);
      throw result.error;
    }
    return result.data;
  }
  async function setSupabaseSession(accessToken) {
    if (!supabaseClient) throw new Error(supabaseErrors[locale].unavailable);
    if (!session || !session.refresh_token || !accessToken) throw new Error(t('loginError'));
    const { session: updatedSession } = unwrap(await supabaseClient.auth.setSession({
      access_token: accessToken,
      refresh_token: session.refresh_token
    }));
    if (!updatedSession) throw new Error(t('loginError'));
    saveSession(updatedSession);
  }
  async function api(action, body, token) {
    if (!supabaseClient) throw new Error(supabaseErrors[locale].notReady);
    const values = body || {};
    if (action === 'logout') {
      return unwrap(await supabaseClient.auth.signOut({ scope: 'local' }));
    }
    if (action === 'login') {
      return unwrap(await supabaseClient.auth.signInWithPassword({
        email: values.email,
        password: values.password
      })).session || {};
    }
    if (action === 'register') {
      return unwrap(await supabaseClient.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: { full_name: values.full_name },
          emailRedirectTo: location.origin + location.pathname
        }
      })).session || {};
    }
    if (action === 'forgot') {
      return unwrap(await supabaseClient.auth.resetPasswordForEmail(values.email, {
        redirectTo: location.origin + location.pathname
      }));
    }
    if (action === 'refresh') {
      return unwrap(await supabaseClient.auth.refreshSession({
        refresh_token: values.refresh_token
      })).session;
    }

    await setSupabaseSession(token);
    if (action === 'user') {
      return unwrap(await supabaseClient.auth.getUser(token)).user;
    }
    if (action === 'update-password') {
      const user = unwrap(await supabaseClient.auth.updateUser({ password: values.password }));
      unwrap(await supabaseClient.auth.signOut({ scope: 'local' }));
      return user;
    }
    if (action === 'save-profile') {
      return unwrap(await supabaseClient.rpc('save_my_profile', {
        p_name: values.name,
        p_grade_id: values.grade_id
      }));
    }
    if (action === 'dashboard') {
      const { user } = unwrap(await supabaseClient.auth.getUser(token));
      if (!user || !user.id) throw new Error(t('loginError'));
      const profile = await loadOrCreateProfile(user);
      const requests = {
        progress: supabaseClient.rpc('my_progress'),
        subscription: supabaseClient.from('my_subscription').select('*').limit(1),
        videos: supabaseClient.from('videos').select('id,title,unit,subject:subjects(name)').order('id', { ascending: true }),
        grades: supabaseClient.from('grades').select('*').order('sort_order', { ascending: true }),
        admin: supabaseClient.rpc('is_admin')
      };
      const entries = await Promise.all(Object.entries(requests).map(async ([name, request]) => {
        const result = await request;
        return [name, result.error ? { error: result.error } : { data: result.data }];
      }));
      const data = {};
      const errors = {};
      entries.forEach(([name, result]) => {
        if (result.error) errors[name] = result.error;
        else data[name] = result.data;
      });
      if (errors.progress && errors.videos) {
        const error = errors.progress;
        error.message = error.message || 'Could not load student progress.';
        throw error;
      }
      return {
        user,
        profile,
        is_admin: Boolean(data.admin),
        progress: data.progress || { secs: 0, done: [], days: [], by: {} },
        subscription: Array.isArray(data.subscription) ? (data.subscription[0] || null) : null,
        videos: data.videos || [],
        totalLessons: (data.videos || []).length,
        grades: data.grades || [],
        warnings: Object.keys(errors)
      };
    }
    throw new Error('Unsupported Supabase action: ' + action);
  }
  async function loadOrCreateProfile(user) {
    const { data: existingProfile, error: readError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    if (readError) throw readError;
    if (existingProfile) return existingProfile;

    const metadata = user.user_metadata || {};
    const profileData = {
      id: user.id,
      email: user.email || '',
      full_name: metadata.full_name || metadata.name || (user.email ? user.email.split('@')[0] : '')
    };
    const { data: createdProfile, error: createError } = await supabaseClient
      .from('profiles')
      .insert(profileData)
      .select('*')
      .single();
    if (!createError) return createdProfile;

    const { data: profileAfterInsert, error: retryReadError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    if (retryReadError) throw retryReadError;
    if (profileAfterInsert) return profileAfterInsert;
    throw createError;
  }
  async function refreshSession() {
    if (!session || !session.refresh_token) return false;
    try {
      const refreshed = await api('refresh', { refresh_token: session.refresh_token });
      saveSession(Object.assign({}, session, refreshed));
      return true;
    } catch {
      saveSession(null);
      if (supabaseClient) await supabaseClient.auth.signOut({ scope: 'local' });
      return false;
    }
  }
  async function authorized(action, body) {
    if (!session || !session.access_token) throw new Error(t('loginError'));
    try {
      return await api(action, body, session.access_token);
    } catch (error) {
      if (error.status !== 401 || !(await refreshSession())) throw error;
      return api(action, body, session.access_token);
    }
  }
  function path() {
    return (location.hash.replace(/^#\/?/, '').split('?')[0] || '').toLowerCase();
  }
  function navigate(route, replace) {
    const target = '#/' + route.replace(/^\/+/, '');
    if (replace) history.replaceState(null, '', target);
    else location.hash = target;
    render();
  }
  function changeLocale() {
    locale = locale === 'ar' ? 'en' : 'ar';
    localStorage.setItem(localeKey, locale);
    render();
  }
  function button(label, action, style) {
    return '<button class="button ' + (style || '') + '" data-action="' + esc(action) + '">' + label + '</button>';
  }
  function icon(mark, cls) {
    return '<span class="icon ' + (cls || '') + '" aria-hidden="true">' + mark + '</span>';
  }
  function banner() {
    return demo ? '<div class="demo-banner"><span>' + esc(t('demo')) + '</span><button data-action="exit-demo">' + esc(t('exitDemo')) + '</button></div>' : '';
  }
  function logo() {
    return '<a class="brand" href="#/dashboard" aria-label="iLogia"><span class="brand-mark">i</span><span class="brand-word">ilogia</span></a>';
  }
  function navItems() {
    return [
      ['dashboard', '⌂', t('home')],
      ['services', '▦', t('services')],
      ['notifications', '♧', t('notifications')],
      ['profile', '◉', t('profile')],
      ['settings', '⚙', t('settings')]
    ];
  }
  function shell(content) {
    const current = path() || 'dashboard';
    const nav = navItems().map(([route, mark, label]) => '<a href="#/' + route + '" class="nav-link ' + (current === route ? 'active' : '') + '" ' + (current === route ? 'aria-current="page"' : '') + '>' + icon(mark) + '<span>' + esc(label) + '</span>' + (route === 'notifications' && unreadCount() ? '<i class="nav-dot"></i>' : '') + '</a>').join('');
    const name = profile && profile.full_name || t('student');
    return banner() +
      '<div class="app-shell">' +
      '<aside class="sidebar">' + logo() + '<p class="side-label">' + esc(locale === 'ar' ? 'القائمة الرئيسية' : 'MAIN MENU') + '</p><nav class="side-nav" aria-label="' + esc(t('home')) + '">' + nav + '</nav>' +
      '<div class="sidebar-bottom"><a class="site-link" href="https://ilogia-eg.com" target="_blank" rel="noopener noreferrer">' + icon('↗') + '<span>' + esc(locale === 'ar' ? 'الموقع الرئيسي' : 'Main website') + '</span></a><p>© iLogia 2026</p></div></aside>' +
      '<div class="main-column"><header class="topbar"><div class="mobile-brand">' + logo() + '</div><div class="topbar-spacer"></div><button class="language-switch" data-action="language" aria-label="' + esc(t('language')) + '">' + esc(t('languageButton')) + '</button><a class="top-user" href="#/profile"><span class="avatar">' + esc((name.trim()[0] || 'ط').toUpperCase()) + '</span><span class="user-name">' + esc(name) + '</span></a></header>' +
      '<main id="main" class="main-content" tabindex="-1">' + content + '</main></div></div>' +
      '<nav class="mobile-nav" aria-label="' + esc(t('home')) + '">' + nav + '</nav><div id="toast" class="toast" role="status" aria-live="polite"></div>';
  }
  function pageHeader(title, subtitle, action) {
    return '<div class="page-header"><div><p class="eyebrow">' + esc(locale === 'ar' ? 'مساحة تعلّمك' : 'YOUR LEARNING SPACE') + '</p><h1>' + esc(title) + '</h1>' + (subtitle ? '<p class="page-subtitle">' + esc(subtitle) + '</p>' : '') + '</div>' + (action || '') + '</div>';
  }
  function subscriptionStatus(sub) {
    if (!sub || !sub.status) return ['neutral', t('noSubscription')];
    const values = {
      active: ['success', t('activeSubscription') + (sub.days_left != null ? ' · ' + t('daysLeft', { n: number(Number(sub.days_left)) }) : '')],
      pending: ['warning', t('pendingSubscription')],
      rejected: ['danger', t('rejectedSubscription')],
      expired: ['neutral', t('expiredSubscription')]
    };
    return values[sub.status] || ['neutral', t('noSubscription')];
  }
  function badge(text, tone) {
    return '<span class="badge badge-' + esc(tone || 'neutral') + '">' + esc(text) + '</span>';
  }
  function cleanProgress(raw) {
    const p = raw && typeof raw === 'object' ? raw : {};
    return { secs: Number(p.secs) || 0, done: Array.isArray(p.done) ? p.done.map(Number) : [], days: Array.isArray(p.days) ? p.days.map(String) : [], by: p.by && typeof p.by === 'object' ? p.by : {} };
  }
  function cairoDay(offset) {
    const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Cairo', year: 'numeric', month: '2-digit', day: '2-digit' });
    const now = new Date();
    now.setDate(now.getDate() + (offset || 0));
    const parts = Object.fromEntries(formatter.formatToParts(now).map((part) => [part.type, part.value]));
    return parts.year + '-' + parts.month + '-' + parts.day;
  }
  function summarize() {
    const p = cleanProgress(dashboard.progress);
    const todayMinutes = Math.round(Number(p.by[cairoDay()] || 0) / 60);
    const days = new Set(p.days);
    let streak = 0;
    for (let i = 0; i < 370; i += 1) {
      const day = cairoDay(-i);
      if (!days.has(day)) {
        if (i === 0) continue;
        break;
      }
      streak += 1;
    }
    return { hours: p.secs / 3600, lessons: p.done.length, activeDays: days.size, streak, todayMinutes, coursePct: dashboard.totalLessons ? Math.round((p.done.length / dashboard.totalLessons) * 100) : 0 };
  }
  function demoData() {
    const today = cairoDay();
    const by = {};
    const days = [];
    for (let i = 83; i >= 0; i -= 1) {
      const d = cairoDay(-i);
      const seed = (i * 37 + 11) % 10;
      if (i < 6 || seed > 4) {
        by[d] = Math.round((seed * 7 + 6) * (1 - i / 120)) * 60;
        days.push(d);
      }
    }
    by[today] = 22 * 60;
    return {
      profile: { id: 'demo', email: 'demo@ilogia.local', full_name: 'طالب تجريبي', onboarded_at: '2026-01-01', grade_id: 9, created_at: '2026-01-01' },
      user: { email: 'demo@ilogia.local', created_at: '2026-01-01' },
      progress: { secs: Object.values(by).reduce((a, b) => a + b, 0), done: [101, 102, 103, 104, 105], days, by },
      subscription: { status: 'active', plan_name: locale === 'ar' ? 'باقة تجريبية' : 'Sample plan', days_left: 5, is_paid: true },
      totalLessons: 40,
      videos: [
        { id: 105, title: 'درس تجريبي: المعادلات من الدرجة الأولى', subject: { name: 'الرياضيات' } },
        { id: 104, title: 'درس تجريبي: أجزاء الخلية', subject: { name: 'العلوم' } },
        { id: 103, title: 'درس تجريبي: الجملة الاسمية', subject: { name: 'اللغة العربية' } },
        { id: 102, title: 'درس تجريبي: المتغيرات في البرمجة', subject: { name: 'البرمجة' } }
      ],
      grades: [{ id: 9, name: 'الصف الثالث الإعدادي', stage: 'إعدادي', sort_order: 9 }],
      is_admin: false
    };
  }
  function getNotices() {
    if (!dashboard) return [];
    const s = summarize();
    const sub = dashboard.subscription;
    const list = [];
    if (sub && sub.status === 'pending') list.push({ id: 'sub-pending', title: t('pendingNotice'), body: t('pendingBody'), href: 'profile' });
    if (sub && sub.status === 'rejected') list.push({ id: 'sub-rejected', title: t('rejectedNotice'), body: t('rejectedBody') });
    if (sub && sub.status === 'active' && Number(sub.days_left) > 0 && Number(sub.days_left) <= 7) list.push({ id: 'sub-exp-' + (sub.expires_at || sub.days_left), title: t('expiringNotice'), body: t('expiringBody', { n: number(Number(sub.days_left)), plan: sub.plan_name || '—' }), tone: 'warning' });
    else if (sub && sub.status === 'active') list.push({ id: 'sub-active-' + (sub.expires_at || ''), title: t('activeNotice'), body: t('activeBody', { n: number(Number(sub.days_left || 0)), plan: sub.plan_name || '—' }), tone: 'success' });
    if (profile && profile.onboarded_at === null) list.push({ id: 'setup', title: t('setupNotice'), body: t('setupBody'), href: 'profile' });
    if (s.todayMinutes >= getGoal()) list.push({ id: 'goal-' + cairoDay(), title: t('goalNotice'), body: t('goalBody', { m: number(s.todayMinutes) }), tone: 'success' });
    if (s.streak >= 3) list.push({ id: 'streak-' + cairoDay(), title: t('streakNotice', { n: number(s.streak) }), body: t('streakBody') });
    return list;
  }
  function getGoal() {
    const n = Number(localStorage.getItem('ilg.goal')) || 30;
    return Math.min(600, Math.max(5, n));
  }
  function unreadIds() {
    try { return JSON.parse(localStorage.getItem('ilg.read') || '[]'); } catch { return []; }
  }
  function unreadCount() {
    return getNotices().filter((notice) => !unreadIds().includes(notice.id)).length;
  }
  function markRead(ids) {
    const all = Array.from(new Set(unreadIds().concat(ids))).slice(-200);
    localStorage.setItem('ilg.read', JSON.stringify(all));
  }
  function heatmap() {
    const p = cleanProgress(dashboard.progress);
    const now = new Date(cairoDay() + 'T12:00:00Z');
    const weekday = now.getUTCDay();
    const sinceSaturday = (weekday + 1) % 7;
    const total = 11 * 7 + sinceSaturday + 1;
    const cells = [];
    for (let i = total - 1; i >= 0; i -= 1) {
      const d = cairoDay(-i);
      const mins = Math.round(Number(p.by[d] || 0) / 60);
      const level = mins === 0 ? 0 : mins < 15 ? 1 : mins < 30 ? 2 : mins < 60 ? 3 : 4;
      cells.push({ day: d, minutes: mins, level });
    }
    return cells;
  }
  function statsCard(mark, label, value, hint) {
    return '<article class="stat-card"><div class="stat-label">' + icon(mark) + '<span>' + esc(label) + '</span></div><div class="stat-value">' + esc(String(value)) + (hint ? '<small>' + esc(hint) + '</small>' : '') + '</div></article>';
  }
  function dashboardPage() {
    const s = summarize();
    const goal = getGoal();
    const pct = Math.min(100, Math.round((s.todayMinutes / goal) * 100));
    const name = (profile && profile.full_name || '').trim().split(/\s+/)[0] || t('student');
    const hour = Number(new Intl.DateTimeFormat('en-US', { timeZone: 'Africa/Cairo', hour: 'numeric', hourCycle: 'h23' }).format(new Date()));
    const notices = getNotices().filter((item) => !unreadIds().includes(item.id)).slice(0, 3);
    const todayLabel = date(new Date(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const cells = heatmap();
    const weekMinutes = cells.reduce((sum, cell) => sum + cell.minutes, 0);
    const studyDays = cells.filter((cell) => cell.minutes > 0).length;
    const best = Math.max(0, ...cells.map((cell) => cell.minutes));
    const avg = Math.round(weekMinutes / Math.max(1, studyDays));
    const status = subscriptionStatus(dashboard.subscription);
    const grade = dashboard.grades.find((item) => Number(item.id) === Number(profile && profile.grade_id)) || (demo ? dashboard.grades[0] : null);
    const recent = cleanProgress(dashboard.progress).done.slice().reverse().map((id) => dashboard.videos.find((video) => Number(video.id) === id)).filter(Boolean).slice(0, 5);
    return '<div class="dashboard-page">' +
      '<section class="welcome-card"><div class="welcome-copy"><p class="welcome-date">' + esc(todayLabel) + '</p><h1>' + esc((hour < 12 ? t('greetingMorning') : t('greetingEvening')) + '، ' + name) + '</h1><div class="welcome-tags">' + badge(status[1], status[0]) + (grade ? '<a href="#/profile" class="grade-chip">' + icon('◇') + esc(grade.name) + '</a>' : '') + (demo ? badge(locale === 'ar' ? 'بيانات تجريبية' : 'Sample data', 'gold') : '') + '</div></div>' +
      '<div class="goal-box"><div class="goal-head"><span>' + icon('◎') + esc(t('goal')) + '</span><button data-action="edit-goal">' + esc(t('editGoal')) + '</button></div><p class="goal-number">' + esc(number(s.todayMinutes)) + '<span> / ' + esc(number(goal)) + ' ' + esc(t('minutes')) + '</span></p><div class="goal-track" role="progressbar" aria-label="' + esc(t('goal')) + '" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100"><span style="width:' + pct + '%"></span></div>' + (pct >= 100 ? '<p class="goal-success">' + esc(t('goalDone')) + '</p>' : '') + '</div></section>' +
      '<section class="stats-grid" aria-label="' + esc(t('home')) + '">' +
      statsCard('◷', t('studyHours'), number(Math.round(s.hours * 10) / 10), '') +
      statsCard('▣', t('lessons'), number(s.lessons), dashboard.totalLessons ? t('of') + ' ' + number(dashboard.totalLessons) : '') +
      statsCard('▦', t('activeDays'), number(s.activeDays), '') +
      statsCard('♨', t('streak'), number(s.streak), '') + '</section>' +
      '<section class="quick-grid">' +
      '<a class="quick-card" href="#/profile"><span class="quick-icon gold-icon">' + icon('▤') + '</span><span class="quick-copy"><small>' + esc(t('subscription')) + '</small><strong>' + esc(dashboard.subscription && dashboard.subscription.plan_name || t('noSubscription')) + '</strong><span>' + esc(t('planDetails')) + '</span></span>' + badge(status[1], status[0]) + '</a>' +
      '<a class="quick-card" href="#/services"><span class="quick-icon">' + icon('✳') + '</span><span class="quick-copy"><small>' + esc(t('services')) + '</small><strong>' + esc(t('ecosystem')) + '</strong><span>' + esc(t('servicesSub')) + '</span></span><b class="quick-arrow">↗</b></a></section>' +
      '<div class="content-grid"><div class="content-main">' +
      '<section class="panel"><div class="section-heading"><h2>' + esc(t('studyMap')) + '</h2><div class="legend"><span>' + esc(t('less')) + '</span>' + [0, 1, 2, 3, 4].map((level) => '<i class="heat heat-' + level + '"></i>').join('') + '<span>' + esc(t('more')) + '</span></div></div>' +
      '<div class="heat-panel"><div class="heat-scroll"><div class="heatmap" role="img" aria-label="' + esc(t('studyMap')) + '">' + cells.map((cell) => '<span class="heat heat-' + cell.level + '" title="' + esc(date(new Date(cell.day + 'T12:00:00Z'), { day: 'numeric', month: 'short' }) + ': ' + cell.minutes + ' ' + t('minutes')) + '"></span>').join('') + '</div></div>' +
      '<div class="week-stats"><div><small>' + esc(t('weekTotal')) + '</small><strong>' + esc(number(Math.round(weekMinutes / 6) / 10)) + ' <i>' + esc(t('hoursUnit')) + '</i></strong></div><div><small>' + esc(t('weekDays')) + '</small><strong>' + esc(number(studyDays)) + ' <i>/ ' + esc(number(cells.length)) + '</i></strong></div><div><small>' + esc(t('bestDay')) + '</small><strong>' + esc(number(best)) + ' <i>' + esc(t('minutes')) + '</i></strong></div><div><small>' + esc(t('avgDay')) + '</small><strong>' + esc(number(avg)) + ' <i>' + esc(t('minutes')) + '</i></strong></div></div></div></section>' +
      '<section class="panel curriculum"><div class="section-heading"><h2>' + esc(t('curriculum')) + '</h2><strong>' + esc(number(s.coursePct)) + '٪</strong></div><p>' + esc(t('curriculumSub', { p: number(s.coursePct) })) + '</p><div class="progress-track"><span style="width:' + s.coursePct + '%"></span></div></section>' +
      '<section class="panel"><div class="section-heading"><div><h2>' + esc(t('ecosystem')) + '</h2><p>' + esc(t('ecosystemSub')) + '</p></div><a class="text-link" href="#/services">' + esc(t('allServices')) + ' ↗</a></div><div class="compact-services">' + services.slice(0, 4).map((service) => serviceRow(service, true)).join('') + '</div></section></div>' +
      '<aside class="content-aside"><section class="panel"><div class="section-heading"><h2>' + esc(t('notices')) + '</h2><a class="text-link" href="#/notifications">' + esc(t('allNotices')) + '</a></div>' + (notices.length ? '<ul class="notice-list">' + notices.map((notice) => '<li><i class="notice-dot"></i><div><strong>' + esc(notice.title) + '</strong><p>' + esc(notice.body) + '</p></div></li>').join('') + '</ul>' : emptyBlock(t('noNotices'), t('noticesSub'))) + '</section>' +
      '<section class="panel"><div class="section-heading"><h2>' + esc(t('recent')) + '</h2></div>' + (recent.length ? '<ul class="recent-list">' + recent.map((video) => '<li>' + icon('▣') + '<span><strong>' + esc(video.title) + '</strong><small>' + esc(video.subject && video.subject.name || '') + '</small></span></li>').join('') + '</ul>' : emptyBlock(t('recentEmpty'), t('recentEmptySub'), '<a class="button button-outline" href="https://ilogia-eg.com" target="_blank" rel="noopener noreferrer">' + esc(t('openLessons')) + '</a>')) + '</section></aside></div>' +
      '</div>';
  }
  function emptyBlock(title, text, action) {
    return '<div class="empty-block"><strong>' + esc(title) + '</strong><p>' + esc(text) + '</p>' + (action || '') + '</div>';
  }
  function serviceRow(service, compact) {
    const isCurrent = service.id === 'app';
    const label = locale === 'ar' ? service.ar : service.en;
    const statusText = service.state === 'live' ? t('live') : t(service.state);
    const content = '<span class="service-icon">' + esc(service.icon) + '</span><span class="service-info"><span class="service-title">' + esc(label) + ' ' + badge(isCurrent ? (locale === 'ar' ? 'أنت هنا' : 'You are here') : statusText, isCurrent || service.state === 'live' ? 'success' : 'neutral') + '</span>' + (compact ? '' : '<small>' + esc(locale === 'ar' ? service.descAr : service.descEn) + '</small>') + '</span><span class="service-domain" dir="ltr">' + esc(service.domain) + '</span>' + (service.state === 'live' && !isCurrent ? '<span class="service-arrow">↗</span>' : '');
    if (service.state === 'live' && !isCurrent) return '<a class="service-row" href="https://' + esc(service.domain) + '" target="_blank" rel="noopener noreferrer">' + content + '</a>';
    return '<div class="service-row" aria-disabled="' + (!isCurrent) + '">' + content + '</div>';
  }
  function publicSiteShell(content) {
    const copy = publicCopy[locale];
    const route = path() || 'home';
    const links = [
      ['home', copy.navHome],
      ['about', copy.navAbout],
      ['public-services', copy.navServices],
      ['contact', copy.navContact]
    ];
    return '<div class="public-site">' +
      '<header class="public-header"><a class="public-brand" href="#/home" aria-label="iLogia"><span class="brand-mark">i</span><span class="brand-word">ilogia</span></a>' +
      '<nav class="public-nav" aria-label="' + esc(copy.navHome) + '">' +
      links.map(([target, label]) => '<a href="#/' + target + '" ' + (route === target ? 'aria-current="page"' : '') + '>' + esc(label) + '</a>').join('') +
      '</nav><div class="public-header-actions"><button class="language-switch" data-action="language" aria-label="' + esc(t('language')) + '">' + esc(t('languageButton')) + '</button><a class="button public-signin" href="#/login">' + esc(copy.signIn) + '</a></div></header>' +
      '<main id="main" class="public-main" tabindex="-1">' + content + '</main>' +
      '<footer class="public-footer"><a class="public-brand" href="#/home"><span class="brand-mark">i</span><span class="brand-word">ilogia</span></a><p>' + esc(copy.footer) + '</p><span>© iLogia 2026</span></footer>' +
      '<div id="toast" class="toast" role="status" aria-live="polite"></div></div>';
  }
  function publicServiceCard(service) {
    const copy = publicCopy[locale];
    const name = locale === 'ar' ? service.ar : service.en;
    const description = locale === 'ar' ? service.descAr : service.descEn;
    const available = service.state === 'live';
    const href = service.id === 'app' ? '#/login' : 'https://' + service.domain;
    return '<article class="public-service-card"><div class="public-service-top"><span class="service-icon">' + esc(service.icon) + '</span><span class="public-service-status ' + (available ? 'is-live' : '') + '">' + esc(available ? copy.available : copy.comingSoon) + '</span></div>' +
      '<h3>' + esc(name) + '</h3><p>' + esc(description) + '</p><a href="' + esc(href) + '"' + (available && service.id !== 'app' ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' + esc(service.id === 'app' ? copy.signIn : t('open')) + ' <span aria-hidden="true">↗</span></a></article>';
  }
  function publicHomePage() {
    const copy = publicCopy[locale];
    return '<section class="public-hero"><div class="public-hero-copy"><p class="public-eyebrow">' + esc(copy.heroEyebrow) + '</p><h1>' + esc(copy.heroTitle) + '</h1><p class="public-lead">' + esc(copy.heroBody) + '</p><div class="public-hero-actions"><a class="button" href="#/login">' + esc(copy.getStarted) + '</a><a class="button button-outline" href="#/public-services">' + esc(copy.exploreServices) + '</a></div><div class="public-proof"><span>✓</span> ' + esc(copy.featureBody) + '</div></div>' +
      '<div class="public-hero-art" aria-hidden="true"><div class="public-art-orbit orbit-one"></div><div class="public-art-orbit orbit-two"></div><div class="public-art-card"><span class="public-art-mark">i</span><strong>' + esc(copy.dashboardLabel) + '</strong><span class="public-art-line"></span><span class="public-art-line short"></span><span class="public-art-progress"><i></i></span><small>' + esc(copy.featureTitle) + '</small></div><span class="public-art-float float-one">✓</span><span class="public-art-float float-two">✦</span></div></section>' +
      '<section class="public-section"><div class="public-section-heading"><div><p class="public-eyebrow">' + esc(copy.navServices) + '</p><h2>' + esc(copy.featureTitle) + '</h2><p>' + esc(copy.featureBody) + '</p></div><a class="text-link" href="#/public-services">' + esc(copy.exploreServices) + ' ↗</a></div><div class="public-service-grid">' + services.slice(0, 3).map(publicServiceCard).join('') + '</div></section>' +
      '<section class="public-steps"><div><p class="public-eyebrow">' + esc(copy.navAbout) + '</p><h2>' + esc(copy.stepsTitle) + '</h2></div><ol><li><span>01</span>' + esc(copy.stepOne) + '</li><li><span>02</span>' + esc(copy.stepTwo) + '</li><li><span>03</span>' + esc(copy.stepThree) + '</li></ol></section>' +
      '<section class="public-cta"><div><h2>' + esc(copy.contactTitle) + '</h2><p>' + esc(copy.contactBody) + '</p></div><a class="button public-cta-button" href="#/login">' + esc(copy.getStarted) + ' ↗</a></section>';
  }
  function publicAboutPage() {
    const copy = publicCopy[locale];
    const points = [copy.aboutPointOne, copy.aboutPointTwo, copy.aboutPointThree];
    return '<section class="public-page-heading"><p class="public-eyebrow">' + esc(copy.navAbout) + '</p><h1>' + esc(copy.aboutTitle) + '</h1><p class="public-lead">' + esc(copy.aboutBody) + '</p></section>' +
      '<section class="public-about-grid"><div class="public-about-illustration"><span>i</span><div><i></i><i></i><i></i></div></div><div><h2>' + esc(copy.featureTitle) + '</h2><p>' + esc(copy.featureBody) + '</p><ul>' + points.map((point) => '<li><span>✓</span>' + esc(point) + '</li>').join('') + '</ul><a class="button" href="#/public-services">' + esc(copy.exploreServices) + '</a></div></section>';
  }
  function publicServicesPage() {
    const copy = publicCopy[locale];
    return '<section class="public-page-heading"><p class="public-eyebrow">' + esc(copy.navServices) + '</p><h1>' + esc(copy.servicesTitle) + '</h1><p class="public-lead">' + esc(copy.servicesBody) + '</p></section>' +
      '<section class="public-service-grid public-service-grid-all">' + services.map(publicServiceCard).join('') + '</section>';
  }
  function publicContactPage() {
    const copy = publicCopy[locale];
    return '<section class="public-contact-card"><span class="public-contact-icon">✦</span><p class="public-eyebrow">' + esc(copy.navContact) + '</p><h1>' + esc(copy.contactTitle) + '</h1><p class="public-lead">' + esc(copy.contactBody) + '</p><div class="public-hero-actions"><a class="button" href="https://ilogia-eg.com" target="_blank" rel="noopener noreferrer">' + esc(copy.contactButton) + ' ↗</a><a class="button button-outline" href="#/login">' + esc(copy.signIn) + '</a></div></section>';
  }
  function publicPage(route) {
    const titles = {
      home: locale === 'ar' ? 'iLogia — تعلّم أذكى، خطوة بخطوة' : 'iLogia — Learn smarter, one step at a time',
      about: publicCopy[locale].aboutTitle + ' — iLogia',
      'public-services': publicCopy[locale].servicesTitle + ' — iLogia',
      contact: publicCopy[locale].navContact + ' — iLogia'
    };
    document.title = titles[route] || titles.home;
    if (route === 'about') return publicAboutPage();
    if (route === 'public-services') return publicServicesPage();
    if (route === 'contact') return publicContactPage();
    return publicHomePage();
  }
  function servicesPage() {
    const tabs = [['all', t('all')], ['live', t('live')], ['soon', t('planned')]];
    const filtered = services.filter((service) => (serviceTab === 'all' || (serviceTab === 'live' ? service.state === 'live' : service.state !== 'live')) && [service.ar, service.en, service.descAr, service.descEn, service.domain].join(' ').toLowerCase().includes(serviceQuery.toLowerCase()));
    return pageHeader(t('services'), t('servicesIntro')) +
      '<section class="panel services-tools"><div class="filter-tabs" role="tablist">' + tabs.map(([id, label]) => '<button role="tab" aria-selected="' + (serviceTab === id) + '" class="' + (serviceTab === id ? 'selected' : '') + '" data-action="service-tab" data-value="' + id + '">' + esc(label) + '</button>').join('') + '</div><label class="search-box">' + icon('⌕') + '<input type="search" data-input="service-search" value="' + esc(serviceQuery) + '" placeholder="' + esc(t('search')) + '" aria-label="' + esc(t('search')) + '"></label></section>' +
      '<section class="panel services-list">' + (filtered.length ? filtered.map(serviceRow).join('') : emptyBlock(t('noServices'), '')) + '</section>';
  }
  function notificationsPage() {
    const all = getNotices();
    const unread = all.filter((notice) => !unreadIds().includes(notice.id));
    const list = noticesTab === 'all' ? all : unread;
    const headAction = unread.length ? button(esc(t('markAll')), 'mark-all', 'button-outline') : '';
    return pageHeader(t('notifications'), '', headAction) +
      '<section class="filter-tabs notification-tabs" role="tablist"><button role="tab" aria-selected="' + (noticesTab === 'all') + '" class="' + (noticesTab === 'all' ? 'selected' : '') + '" data-action="notice-tab" data-value="all">' + esc(t('allTab')) + ' <i>' + number(all.length) + '</i></button><button role="tab" aria-selected="' + (noticesTab === 'unread') + '" class="' + (noticesTab === 'unread' ? 'selected' : '') + '" data-action="notice-tab" data-value="unread">' + esc(t('unread')) + ' <i>' + number(unread.length) + '</i></button></section>' +
      '<section class="panel notice-page-list">' + (list.length ? list.map((notice) => {
        const read = unreadIds().includes(notice.id);
        return '<article class="notice-item ' + (read ? '' : 'notice-unread') + '"><i class="notice-dot"></i><div class="notice-copy"><strong>' + esc(notice.title) + (read ? '' : '<small>' + esc(t('unread')) + '</small>') + '</strong><p>' + esc(notice.body) + '</p>' + (notice.href ? '<a class="text-link" href="#/' + esc(notice.href) + '">' + esc(t('profile')) + ' ↗</a>' : '') + '</div>' + (!read ? '<button class="icon-button" data-action="mark-one" data-id="' + esc(notice.id) + '" aria-label="' + esc(t('markOne')) + '">✓</button>' : '') + '</article>';
      }).join('') : emptyBlock(t('noNotices'), t('noticesSub'))) + '</section>';
  }
  function roleName() {
    return dashboard.is_admin ? t('adminRole') : (profile && profile.is_teacher ? t('teacherRole') : t('studentRole'));
  }
  function profilePage() {
    if (editingProfile) {
      const grades = dashboard.grades || [];
      return pageHeader(t('profile')) +
        '<section class="panel profile-panel"><div class="profile-banner"><span class="avatar avatar-large">' + esc((profile.full_name || 'ط')[0]) + '</span><div><h2>' + esc(profile.full_name || '—') + '</h2><p>' + esc(profile.email || '') + '</p></div></div><form id="profile-form" class="form-grid" data-form="profile"><label>' + esc(t('name')) + '<input name="name" minlength="3" required value="' + esc(profile.full_name || '') + '"></label><label>' + esc(t('grade')) + '<select name="grade_id" required><option value="">' + esc(t('chooseGrade')) + '</option>' + grades.map((grade) => '<option value="' + esc(grade.id) + '" ' + (Number(grade.id) === Number(profile.grade_id) ? 'selected' : '') + '>' + esc(grade.name) + '</option>').join('') + '</select></label><p class="form-hint">' + esc(t('emailNote')) + '</p><div class="form-actions"><button class="button" type="submit">' + esc(t('save')) + '</button><button class="button button-ghost" type="button" data-action="cancel-profile">' + esc(t('cancel')) + '</button></div></form></section>';
    }
    const grade = dashboard.grades.find((item) => Number(item.id) === Number(profile.grade_id));
    const sub = subscriptionStatus(dashboard.subscription);
    const rows = [
      [t('email'), profile.email || '—'],
      [t('grade'), grade ? grade.name : '—'],
      [t('role'), roleName()],
      [t('memberSince'), profile.created_at ? date(new Date(profile.created_at), { day: 'numeric', month: 'long', year: 'numeric' }) : '—'],
      [t('subscription'), sub[1]]
    ];
    return pageHeader(t('profile')) + '<section class="panel profile-panel"><div class="profile-banner"><span class="avatar avatar-large">' + esc((profile.full_name || 'ط')[0]) + '</span><div class="profile-main"><h2>' + esc(profile.full_name || '—') + '</h2><p dir="ltr">' + esc(profile.email || '') + '</p><div class="profile-tags">' + badge(roleName(), 'neutral') + (demo ? badge(locale === 'ar' ? 'حساب تجريبي' : 'Demo account', 'gold') : '') + '</div></div>' + (demo ? '' : button(esc(t('edit')), 'edit-profile', 'button-outline')) + '</div><dl class="profile-details">' + rows.map((row) => '<div><dt>' + esc(row[0]) + '</dt><dd>' + esc(row[1]) + '</dd></div>').join('') + '</dl></section>';
  }
  function settingsPage() {
    return pageHeader(t('settings')) + '<section class="panel settings-list">' +
      '<div class="setting-row"><div><strong>' + esc(t('language')) + '</strong><p>' + esc(t('languageHelp')) + '</p></div><div class="segmented"><button data-action="locale" data-value="ar" class="' + (locale === 'ar' ? 'selected' : '') + '">العربية</button><button data-action="locale" data-value="en" class="' + (locale === 'en' ? 'selected' : '') + '">English</button></div></div>' +
      (locale === 'ar' ? '<div class="setting-row"><div><strong>' + esc(t('digits')) + '</strong></div><div class="segmented"><button data-action="digits" data-value="arab" class="' + (localStorage.getItem('ilg.digits') !== 'latn' ? 'selected' : '') + '">' + esc(t('arabDigits')) + '</button><button data-action="digits" data-value="latn" class="' + (localStorage.getItem('ilg.digits') === 'latn' ? 'selected' : '') + '">' + esc(t('latinDigits')) + '</button></div></div>' : '') +
      '<div class="setting-row"><div><strong>' + esc(t('dailyGoal')) + '</strong><p>' + esc(t('goalHelp')) + '</p></div><form id="goal-form" class="inline-form" data-form="goal"><label class="sr-only" for="goal-setting">' + esc(t('dailyGoal')) + '</label><input id="goal-setting" name="goal" type="number" min="5" max="600" required value="' + getGoal() + '"><span>' + esc(t('minutes')) + '</span><button class="button button-outline" type="submit">' + esc(t('save')) + '</button></form></div>' +
      '<div class="setting-row"><div><strong>' + esc(t('session')) + '</strong><p>' + esc(t('sessionHelp')) + '</p></div>' + button(esc(t('logout')), 'logout', 'button-danger') + '</div></section>';
  }
  function authPage(route) {
    const isRegister = route === 'register';
    const isForgot = route === 'forgot';
    const isReset = route === 'reset-password';
    const isLogin = !isRegister && !isForgot && !isReset;
    const title = isReset ? t('resetTitle') : (isForgot ? t('forgotTitle') : (isRegister ? t('registerTitle') : t('loginTitle')));
    const subtitle = isReset ? '' : (isForgot ? t('forgotSub') : (isRegister ? t('registerSub') : t('loginSub')));
    let form = '';
    if (isReset) {
      form = '<form id="auth-form" class="auth-form" data-form="reset-password"><label>' + esc(t('newPassword')) + '<input name="password" type="password" autocomplete="new-password" minlength="8" required></label><label>' + esc(t('confirm')) + '<input name="confirm" type="password" autocomplete="new-password" minlength="8" required></label><button class="button button-wide" type="submit">' + esc(t('updatePassword')) + '</button></form>';
    } else if (isForgot) {
      form = '<form id="auth-form" class="auth-form" data-form="forgot"><label>' + esc(t('email')) + '<input name="email" type="email" autocomplete="email" required></label><button class="button button-wide" type="submit">' + esc(t('sendLink')) + '</button></form>';
    } else if (isRegister) {
      form = '<form id="auth-form" class="auth-form" data-form="register"><label>' + esc(t('fullName')) + '<input name="name" autocomplete="name" minlength="3" required></label><label>' + esc(t('email')) + '<input name="email" type="email" autocomplete="email" required></label><label>' + esc(t('password')) + '<input name="password" type="password" autocomplete="new-password" minlength="8" required></label><label>' + esc(t('confirm')) + '<input name="confirm" type="password" autocomplete="new-password" minlength="8" required></label><button class="button button-wide" type="submit">' + esc(t('createAccount')) + '</button></form>';
    } else {
      form = '<form id="auth-form" class="auth-form" data-form="login"><label>' + esc(t('email')) + '<input name="email" type="email" autocomplete="email" required></label><label>' + esc(t('password')) + '<input name="password" type="password" autocomplete="current-password" required></label><a class="forgot-link" href="#/forgot">' + esc(t('forgot')) + '</a><button class="button button-wide" type="submit">' + esc(t('submitLogin')) + '</button></form>';
    }
    const configured = supabaseClient !== null;
    const googleOption = isLogin || isRegister
      ? '<div class="auth-divider"><span>' + esc(t('or')) + '</span></div>' + button('<span class="google-mark" aria-hidden="true">G</span>' + esc(t('continueGoogle')), 'google-auth', 'button-outline button-wide google-button')
      : '';
    const demoOption = isLogin
      ? '<div class="auth-divider"><span>' + esc(t('or')) + '</span></div>' + button(esc(t('demoEnter')), 'enter-demo', 'button-outline button-wide')
      : '';
    return '<main class="auth-page"><section class="auth-card"><div class="auth-card-top"><a class="public-brand" href="#/home" aria-label="iLogia"><span class="brand-mark">i</span><span class="brand-word">ilogia</span></a><button class="language-switch" data-action="language">' + esc(t('languageButton')) + '</button></div>' +
      (isReset || isForgot ? '' : '<div class="auth-tabs"><a href="#/login" class="' + (!isRegister ? 'selected' : '') + '">' + esc(t('signIn')) + '</a><a href="#/register" class="' + (isRegister ? 'selected' : '') + '">' + esc(t('register')) + '</a></div>') +
      '<h1>' + esc(title) + '</h1><p class="auth-subtitle">' + esc(subtitle) + '</p>' +
      (!configured && !demo ? '<div class="auth-note">' + esc(t('configMissing')) + '</div>' : '') +
      (window.authError ? '<div class="auth-note" role="alert">' + esc(window.authError) + '</div>' : '') +
      (isRegister && window.registered ? '<div class="success-note">' + esc(t('registered')) + '</div>' : '') +
      (isForgot && window.forgotSent ? '<div class="success-note">' + esc(t('emailSent')) + '</div>' : '') +
      form + googleOption + demoOption + '<p class="auth-footer">' + (isForgot || isReset ? '<a href="#/login">' + esc(t('backLogin')) + '</a>' : isRegister ? esc(t('hasAccount')) + ' <a href="#/login">' + esc(t('signIn')) + '</a>' : esc(t('noAccount')) + ' <a href="#/register">' + esc(t('register')) + '</a>') + '</p></section>' +
      '<aside class="auth-art"><span class="auth-art-badge">iLogia · ' + esc(locale === 'ar' ? 'لوحة الطالب' : 'Student dashboard') + '</span><h2>' + esc(locale === 'ar' ? 'كل خطوة في تعلّمك، تقرّبك من هدفك.' : 'Every step you learn brings you closer.') + '</h2><p>' + esc(locale === 'ar' ? 'تقدّمك في الدروس، أيام مذاكرتك، اشتراكك، وكل الخدمات — بحساب واحد.' : 'Lesson progress, study days, your subscription and every service — with one account.') + '</p><div class="auth-stamp">✓ <span>' + esc(locale === 'ar' ? 'ابدأ رحلتك اليوم' : 'Start learning today') + '</span></div></aside></main><div id="toast" class="toast" role="status" aria-live="polite"></div>';
  }
  function loadingPage() {
    return '<div class="loading-card" role="status"><span class="spinner"></span><p>' + esc(locale === 'ar' ? 'جارٍ تحميل بياناتك...' : 'Loading your dashboard...') + '</p></div>';
  }
  function errorPage(error) {
    return '<section class="error-card"><span class="error-mark">!</span><h1>' + esc(t('errorLoad')) + '</h1><p>' + esc(error || t('errorBody')) + '</p>' + button(esc(t('retry')), 'reload', 'button-outline') + '</section>';
  }
  function toast(message) {
    const node = document.getElementById('toast');
    if (!node) return;
    node.textContent = message;
    node.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove('visible'), 2600);
  }
  async function loadDashboard() {
    if (demo) {
      profile = demoData().profile;
      dashboard = demoData();
      return;
    }
    if (!session) throw new Error(t('loginError'));
    dashboard = await authorized('dashboard');
    profile = dashboard.profile || null;
  }
  async function render() {
    const route = path() || (session || demo ? 'dashboard' : 'home');
    const publicRoutes = ['home', 'about', 'public-services', 'contact'];
    const dashboardRoutes = ['dashboard', 'services', 'notifications', 'profile', 'settings'];
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    if (publicRoutes.includes(route)) {
      app.innerHTML = publicSiteShell(publicPage(route));
      return;
    }
    if (!session && !demo && (dashboardRoutes.includes(route) || !['login', 'register', 'forgot', 'reset-password'].includes(route))) {
      navigate('login', true);
      return;
    }
    if ((session || demo) && ['login', 'register', 'forgot'].includes(route)) {
      navigate('dashboard', true);
      return;
    }
    if (['login', 'register', 'forgot', 'reset-password'].includes(route)) {
      if (route === 'reset-password' && !session) {
        navigate('login', true);
        return;
      }
      app.innerHTML = authPage(route);
      return;
    }
    if (route === 'dashboard' || !dashboard) {
      app.innerHTML = shell(loadingPage());
      try {
        await loadDashboard();
        const view = route === 'dashboard' ? dashboardPage() : route === 'services' ? servicesPage() : route === 'notifications' ? notificationsPage() : route === 'profile' ? profilePage() : route === 'settings' ? settingsPage() : errorPage(t('notFound'));
        app.innerHTML = shell(view);
      } catch (error) {
        if (error.status === 401) {
          saveSession(null);
          dashboard = null;
          navigate('login', true);
          return;
        }
        app.innerHTML = shell(errorPage(error.message));
      }
      return;
    }
    const view = route === 'services' ? servicesPage() : route === 'notifications' ? notificationsPage() : route === 'profile' ? profilePage() : route === 'settings' ? settingsPage() : errorPage(t('notFound'));
    app.innerHTML = shell(view);
  }
  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  }
  async function submitAuth(form) {
    const data = Object.fromEntries(new FormData(form).entries());
    const type = form.dataset.form;
    if (type === 'login') {
      if (!validEmail(String(data.email || '').trim())) throw new Error(t('emailInvalid'));
      if (!data.password) throw new Error(t('required'));
      const result = await api('login', { email: String(data.email).trim(), password: data.password });
      if (!result.access_token) throw new Error(t('loginError'));
      saveSession(result);
      demo = false;
      sessionStorage.removeItem(DEMO_KEY);
      dashboard = null;
      window.registered = false;
      navigate('dashboard', true);
    } else if (type === 'register') {
      if (String(data.name || '').trim().length < 3) throw new Error(t('nameInvalid'));
      if (!validEmail(String(data.email || '').trim())) throw new Error(t('emailInvalid'));
      if (String(data.password || '').length < 8) throw new Error(t('passwordShort'));
      if (data.password !== data.confirm) throw new Error(t('passwordMatch'));
      const result = await api('register', { full_name: String(data.name).trim(), email: String(data.email).trim(), password: data.password });
      if (result.access_token) {
        saveSession(result);
        dashboard = null;
        navigate('dashboard', true);
        return;
      }
      window.registered = true;
      render();
    } else if (type === 'forgot') {
      if (!validEmail(String(data.email || '').trim())) throw new Error(t('emailInvalid'));
      await api('forgot', { email: String(data.email).trim() });
      window.forgotSent = true;
      render();
    } else if (type === 'reset-password') {
      if (String(data.password || '').length < 8) throw new Error(t('passwordShort'));
      if (data.password !== data.confirm) throw new Error(t('passwordMatch'));
      await authorized('update-password', { password: data.password });
      saveSession(null);
      dashboard = null;
      navigate('login', true);
      toast(t('saved'));
    } else if (type === 'profile') {
      const name = String(data.name || '').trim();
      const gradeId = Number(data.grade_id);
      if (name.length < 3) throw new Error(t('nameInvalid'));
      if (!Number.isInteger(gradeId) || gradeId < 1) throw new Error(t('gradeInvalid'));
      await authorized('save-profile', { name, grade_id: gradeId });
      dashboard = null;
      editingProfile = false;
      await render();
      toast(t('saved'));
    } else if (type === 'goal') {
      const goal = Number(data.goal);
      if (!Number.isInteger(goal) || goal < 5 || goal > 600) throw new Error('5 – 600');
      localStorage.setItem('ilg.goal', String(goal));
      await render();
      toast(t('savedSettings'));
    }
  }
  async function signInWithGoogle() {
    if (!supabaseClient) throw new Error(supabaseErrors[locale].notReady);
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: location.origin + location.pathname }
    });
    if (error) throw error;
  }
  function clickAction(buttonNode) {
    const action = buttonNode.dataset.action;
    const value = buttonNode.dataset.value;
    if (action === 'language') { changeLocale(); return; }
    if (action === 'google-auth') {
      buttonNode.disabled = true;
      signInWithGoogle().catch((error) => {
        buttonNode.disabled = false;
        toast(error.message || t('errorGeneric'));
      });
      return;
    }
    if (action === 'locale') { locale = value; localStorage.setItem(localeKey, locale); render(); return; }
    if (action === 'digits') { localStorage.setItem('ilg.digits', value); render(); return; }
    if (action === 'service-tab') { serviceTab = value; render(); return; }
    if (action === 'notice-tab') { noticesTab = value; render(); return; }
    if (action === 'mark-one') { markRead([buttonNode.dataset.id]); render(); return; }
    if (action === 'mark-all') { markRead(getNotices().map((notice) => notice.id)); render(); return; }
    if (action === 'edit-profile') { editingProfile = true; render(); return; }
    if (action === 'cancel-profile') { editingProfile = false; render(); return; }
    if (action === 'edit-goal') {
      const valueGoal = prompt(t('dailyGoal') + ' (5–600)', String(getGoal()));
      if (valueGoal === null) return;
      const goal = Number(valueGoal);
      if (!Number.isInteger(goal) || goal < 5 || goal > 600) { toast('5 – 600'); return; }
      localStorage.setItem('ilg.goal', String(goal));
      render();
      toast(t('savedSettings'));
      return;
    }
    if (action === 'enter-demo') {
      demo = true;
      sessionStorage.setItem(DEMO_KEY, '1');
      dashboard = null;
      navigate('dashboard', true);
      return;
    }
    if (action === 'exit-demo' || action === 'logout') {
      if (session && session.access_token) api('logout', {}, session.access_token).catch(() => {});
      saveSession(null);
      demo = false;
      dashboard = null;
      profile = null;
      sessionStorage.removeItem(DEMO_KEY);
      navigate('home', true);
      return;
    }
    if (action === 'reload') { dashboard = null; render(); }
  }

  app.addEventListener('click', (event) => {
    const target = event.target.closest('[data-action]');
    if (!target) return;
    event.preventDefault();
    clickAction(target);
  });
  app.addEventListener('input', (event) => {
    const target = event.target;
    if (target.matches('[data-input="service-search"]')) {
      serviceQuery = target.value.trim().toLowerCase();
      const selection = target.selectionStart;
      const result = document.querySelector('.services-list');
      if (result) {
        const filtered = services.filter((service) => (serviceTab === 'all' || (serviceTab === 'live' ? service.state === 'live' : service.state !== 'live')) && [service.ar, service.en, service.descAr, service.descEn, service.domain].join(' ').toLowerCase().includes(serviceQuery));
        result.innerHTML = filtered.length ? filtered.map(serviceRow).join('') : emptyBlock(t('noServices'), '');
      }
      target.focus();
      target.setSelectionRange(selection, selection);
    }
  });
  app.addEventListener('submit', async (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    event.preventDefault();
    try {
      await submitAuth(form);
    } catch (error) {
      toast(error.message || t('errorGeneric'));
    }
  });
  function restoreRecoverySession() {
    const raw = location.hash.slice(1);
    if (!raw || raw.startsWith('/')) return;
    const params = new URLSearchParams(raw);
    const accessToken = params.get('access_token');
    if (accessToken && params.get('type') === 'recovery') {
      saveSession({ access_token: accessToken, refresh_token: params.get('refresh_token') || '', expires_at: params.get('expires_at') });
      history.replaceState(null, '', location.pathname + location.search + '#/reset-password');
    } else if (accessToken) {
      saveSession({ access_token: accessToken, refresh_token: params.get('refresh_token') || '', expires_at: params.get('expires_at') });
      history.replaceState(null, '', location.pathname + location.search + '#/dashboard');
    } else if (params.get('error_description')) {
      history.replaceState(null, '', location.pathname + location.search + '#/login');
      window.authError = params.get('error_description');
    }
  }
  async function restoreOAuthSession() {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    if (!code) return;
    try {
      if (!supabaseClient) throw new Error(supabaseErrors[locale].notReady);
      const { data, error } = await supabaseClient.auth.exchangeCodeForSession(code);
      if (error) throw error;
      if (!data.session) throw new Error(t('loginError'));
      saveSession(data.session);
      window.authError = '';
      history.replaceState(null, '', location.pathname + '#/dashboard');
    } catch (error) {
      window.authError = error.message || t('loginError');
      history.replaceState(null, '', location.pathname + '#/login');
    }
  }
  async function initializeApp() {
    await restoreOAuthSession();
    if (location.hash && !location.hash.slice(1).startsWith('/')) restoreRecoverySession();
    if (!location.hash) location.hash = session || demo ? '#/dashboard' : '#/home';
    await render();
  }
  window.addEventListener('hashchange', () => { restoreRecoverySession(); render(); });
  initializeApp().catch((error) => {
    window.authError = error.message || t('errorGeneric');
    saveSession(null);
    navigate('login', true);
  });
}());
