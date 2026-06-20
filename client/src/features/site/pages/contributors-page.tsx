import { IMAGES } from '#/assets/images'

type Contributor = {
  name: string
  role: string
  image: string
}
const CARD_VARIANTS = ['blue', 'yellow', 'pink', 'purple', 'green']

const imageArray: Contributor[] = [
  {
    name: 'peace braide',
    role: 'frontend engineer',
    image: IMAGES.peaceMarionbraide,
  },
  {
    name: 'ejemen iboi',
    role: 'frontend engineer',
    image: IMAGES.osezeleIboi,
  },
  {
    name: 'fatihat akinwunmi',
    role: 'frontend engineer',
    image: IMAGES.fatihatAkinwumi,
  },
  {
    name: 'oluchi okuwuosa',
    role: 'frontend engineer',
    image: IMAGES.oluchiOkwuosa,
  },
  {
    name: 'florence onwuegbuzie',
    role: 'frontend engineer',
    image: IMAGES.florenceOnwuegbuzie,
  },
  {
    name: 'esther orieji',
    role: 'frontend engineer',
    image: IMAGES.estherOrieji,
  },
  {
    name: 'victor okoukuni',
    role: 'frontend engineer',
    image: IMAGES.victorOkoukoni,
  },
  {
    name: 'gabriel abubakar',
    role: 'QA engineer',
    image: IMAGES.gabrielAbubakar,
  },
  {
    name: 'fisayo rotibi',
    role: 'UI/UX designer',
    image: IMAGES.fisayoRotibi,
  },
  {
    name: 'olusegun adeleke',
    role: 'backend engineer',
    image: IMAGES.olusegunAdeleke,
  },
  {
    name: 'wisdom osuji',
    role: 'UI/UX engineer',
    image: IMAGES.wisdomOsuji,
  },
  {
    name: 'michael babajide',
    role: 'UI/UX engineer',
    image: IMAGES.michaelBabajide,
  },
]
export function ContributorsPage() {
  return (
    <div>
      <h1>Contributors</h1>
    </div>
  )
}
