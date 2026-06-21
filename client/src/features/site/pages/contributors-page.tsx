import type { CSSProperties } from 'react'

import { IMAGES } from '#/assets/images'

type Contributor = {
  name: string
  role: string
  image: string
  style?: CSSProperties
}
const CARD_VARIANTS = ['blue', 'yellow', 'pink', 'purple', 'green'] as const

const imageArray: Contributor[] = [
  {
    name: 'peace braide',
    role: 'frontend engineer',
    image: IMAGES.contributors.peaceMarionbraide,
    style: { transform: 'scale(1.3)', marginTop: '-20px' },
  },
  {
    name: 'ejemen iboi',
    role: 'frontend engineer',
    image: IMAGES.contributors.osezeleIboi,
    style: { marginTop: '16px' },
  },
  {
    name: 'fatihat akinwunmi',
    role: 'frontend engineer',
    image: IMAGES.contributors.fatihatAkinwumi,

    style: { transform: 'scale(1.4)', marginTop: '-4px' },
  },
  {
    name: 'oluchi okuwuosa',
    role: 'frontend engineer',
    image: IMAGES.contributors.oluchiOkwuosa,
    style: {
      transform: 'scale(0.99)',
      objectPosition: 'bottom right',
      marginTop: '24px',
    },
  },
  {
    name: 'florence onwuegbuzie',
    role: 'frontend engineer',
    image: IMAGES.contributors.florenceOnwuegbuzie,
  },
  {
    name: 'esther orieji',
    role: 'frontend engineer',
    image: IMAGES.contributors.estherOrieji,
  },
  {
    name: 'victor okoukuni',
    role: 'frontend engineer',
    image: IMAGES.contributors.victorOkoukoni,

    style: { objectPosition: 'top center', marginTop: '8px' },
  },
  {
    name: 'gabriel abubakar',
    role: 'QA engineer',
    image: IMAGES.contributors.gabrielAbubakar,
    style: {
      objectPosition: 'bottom right',
      transform: 'scale(1.2)',
      marginTop: '-4px',
    },
  },
  {
    name: 'fisayo rotibi',
    role: 'UI/UX designer',
    image: IMAGES.contributors.fisayoRotibi,
    style: {
      objectPosition: 'bottom center',
      transform: 'scale(1.2)',
      margin: '-16px 0 0 -12px',
    },
  },
  {
    name: 'olusegun adeleke',
    role: 'backend engineer',
    image: IMAGES.contributors.olusegunAdeleke,
    style: { objectPosition: 'top center', marginTop: '16px' },
  },
  {
    name: 'wisdom osuji',
    role: 'UI/UX engineer',
    image: IMAGES.contributors.wisdomOsuji,
  },
  {
    name: 'michael babajide',
    role: 'UI/UX engineer',
    image: IMAGES.contributors.michaelBabajide,
    style: { transform: 'scale(1.1)', marginTop: '-4px' },
  },
  {
    name: 'Iyobosa Omoruyi',
    role: 'Frontend Engineer',
    image: IMAGES.contributors.iyobosaOmoruyi,
    style: { marginTop: '20px' },
  },
]
export function ContributorsPage() {
  return (
    <main className="flex flex-col items-center justify-center py-10 md:m-20 md:px-10">
      <div className="max-w-max px-4 pb-5 text-left md:px-8 md:pb-10">
        <p className="text-content-secondary mb-4 text-base leading-relaxed">
          Hi, we are the small team contributing to Ekehi, an open-source
          resource center that helps women entrepreneurs across Africa find the
          funding, training, and support they shouldn't have to struggle to
          discover. We design, build and maintain this platform beecause we
          believe access to opportunity shouldn't depend on who you know.
        </p>
        <span className="mb-0 text-neutral-700">
          Meet us — The Contributors
        </span>
      </div>
      <div className="grid max-w-max grid-cols-[repeat(auto-fit,minmax(160px,1fr))] justify-center gap-3 px-4 pt-6 pb-16 max-md:w-full md:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] md:gap-6 md:px-8">
        {imageArray.map(({ name, role, image, style }, index) => {
          const variant = CARD_VARIANTS[index % CARD_VARIANTS.length]
          return (
            <article key={name} className="overflow-hidden bg-cover bg-center">
              <figure
                className="relative mb-3 aspect-square w-full shrink-0 overflow-hidden rounded-lg bg-cover bg-center"
                style={{
                  backgroundImage: `url(${IMAGES.cardBackgrounds[variant]})`,
                }}
              >
                {image ? (
                  <img
                    className="object-top-center block h-full w-full object-cover grayscale-100 hover:grayscale-0"
                    src={image}
                    alt={name}
                    style={style}
                  />
                ) : null}
              </figure>

              <h3 className="text-sm leading-tight font-medium capitalize md:text-lg">
                {name}
              </h3>
              <p className="text-xs leading-normal text-gray-500 capitalize md:text-sm">
                {role}
              </p>
            </article>
          )
        })}
      </div>
      <div className="max-w-max px-4 pb-5 text-left md:px-8 md:pb-10">
        <p className="mb-4 text-base leading-relaxed">
          We don't take for granted what it takes to build something like this.
          Ekehi exists because designers gave their weekends, developers shipped
          between day jobs, and researchers verified hundred of listings one by
          one. We created this page to acknowledge everyone that contributed to
          the building of Ekehi
        </p>
        <span>Thank you, have a wonderful day 👋🏽</span>
      </div>
    </main>
  )
}
