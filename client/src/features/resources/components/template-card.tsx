import { Link } from '@tanstack/react-router'

import { IMAGES } from '#/assets/images'

import type { TemplateListItem } from '../resources.types'
import { TemplateGridSVG } from '../svgs/template-grid'

const colorTheme = [
  {
    card: '#26B3B5',
    foreground: '#054445',
  },
  {
    card: '#FF58AB',
    foreground: '#34021B',
  },
  {
    card: '#26B678',
    foreground: '#034227',
  },
]

export function TemplateCard({
  template,
  index,
}: {
  template: TemplateListItem
  index: number
}) {
  const theme = colorTheme[index % colorTheme.length]

  return (
    <article className="overflow-hidden rounded-2xl border border-[#DFDFDF]">
      <figure className="relative aspect-352/208 border-b border-[#DFDFDF]">
        <TemplateGridSVG />
        <div
          style={{
            color: theme.foreground,
            backgroundColor: theme.card,
          }}
          className="absolute top-20 right-16 flex h-65 w-45 rotate-16 flex-col gap-4 rounded-sm p-5 text-balance md:right-20"
        >
          <h4 className="text-[0.8125rem] leading-[120%] font-medium">
            {template.title}
          </h4>
          <img src={IMAGES.blackWomanWearingGlasses} className="rounded-sm" />
        </div>
      </figure>

      <div className="relative z-1 bg-white px-4 py-5">
        <h3 className="mb-2 line-clamp-1 font-medium text-neutral-900">
          {template.title}
        </h3>
        {template.description && (
          <p className="mb-3 line-clamp-3 text-sm leading-[150%] text-neutral-700">
            {template.description}
          </p>
        )}
        <Link
          to="/resources/templates/$id"
          params={{ id: template.id }}
          className="text-sm text-purple-600"
        >
          Read more
        </Link>
      </div>
    </article>
  )
}
