/* eslint-disable simple-import-sort/imports -- hand-grouped barrel; keep the section comments */

// Contributors
import estherOrieji from '#/assets/images/contributors/esther-orieji.png'
import fatihatAkinwumi from '#/assets/images/contributors/fatihat-akinwumi.png'
import fisayoRotibi from '#/assets/images/contributors/fisayo-rotibi.png'
import florenceOnwuegbuzie from '#/assets/images/contributors/florence-onwuegbuzie.png'
import gabrielAbubakar from '#/assets/images/contributors/gabriel-abubakar.png'
import iyobosaOmoruyi from '#/assets/images/contributors/iyobosa-omoruyi.png'
import michaelBabajide from '#/assets/images/contributors/michael-babajide.png'
import oluchiOkwuosa from '#/assets/images/contributors/oluchi-okwuosa.png'
import olusegunAdeleke from '#/assets/images/contributors/olusegun-adeleke.png'
import osezeleIboi from '#/assets/images/contributors/osezele-iboi.png'
import peaceMarionbraide from '#/assets/images/contributors/peace-marionbraide.png'
import victorOkoukoni from '#/assets/images/contributors/victor-okoukoni.png'
import wisdomOsuji from '#/assets/images/contributors/wisdom-osuji.png'

// Card Backgrounds
// `?no-inline` keeps these as emitted files, not data URIs. They contain
// internal url(#filter)/url(#clip) refs; inlined, the first `#` truncates the
// data URI in CSS url() and the background never renders.
import cardBgBlue from '#/assets/card-backgrounds/card-bg-blue.svg?no-inline'
import cardBgGreen from '#/assets/card-backgrounds/card-bg-green.svg?no-inline'
import cardBgPink from '#/assets/card-backgrounds/card-bg-pink.svg?no-inline'
import cardBgPurple from '#/assets/card-backgrounds/card-bg-purple.svg?no-inline'
import cardBgYellow from '#/assets/card-backgrounds/card-bg-yellow.svg?no-inline'

// Others
import blackWomanWearingGlasses from './black-woman-wearing-glasses.png'
import ctaSectionDisplay from './cta-section-display.png'
import headerImg from './header-img.png'
import heroDisplay from './hero-display.jpg'
import offeringsDisplay from './offerings-display.jpg'
import timeVector from './time-vector.png'
import valuePropositionDisplay from './value-proposition-display.png'

export const IMAGES = {
  blackWomanWearingGlasses,
  ctaSectionDisplay,
  headerImg,
  heroDisplay,
  offeringsDisplay,
  timeVector,
  valuePropositionDisplay,
  contributors: {
    wisdomOsuji,
    victorOkoukoni,
    peaceMarionbraide,
    osezeleIboi,
    olusegunAdeleke,
    oluchiOkwuosa,
    michaelBabajide,
    iyobosaOmoruyi,
    gabrielAbubakar,
    florenceOnwuegbuzie,
    fisayoRotibi,
    fatihatAkinwumi,
    estherOrieji,
  },
  cardBackgrounds: {
    blue: cardBgBlue,
    yellow: cardBgYellow,
    pink: cardBgPink,
    purple: cardBgPurple,
    green: cardBgGreen,
  },
} as const
