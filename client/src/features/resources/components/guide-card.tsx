import { Link } from '@tanstack/react-router'

import { IMAGES } from '#/assets/images'

import type { GuideListItem } from '../resources.types'

export function GuideCard({ guide }: { guide: GuideListItem }) {
  return (
    <div>
      <figure className="mb-5 aspect-352/195 overflow-hidden rounded-lg bg-purple-50">
        <img src={IMAGES['guideCardDisplay']} alt="" />
      </figure>
      <h3 className="mb-2 leading-[120%] font-medium text-neutral-900">
        <Link to="/resources/guides/$slug" params={{ slug: guide.slug }}>
          {guide.title}
        </Link>
      </h3>
      {guide.summary && (
        <p className="line-clamp-3 text-sm leading-[150%] text-neutral-700">
          {guide.summary}
        </p>
      )}
    </div>
  )
}
