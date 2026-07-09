import { Link } from '@tanstack/react-router'
import React, { useEffect, useRef, useState } from 'react'

import { isApiError } from '#/lib/api'

import { useGuideQuery } from '../resources.query'

interface ContentSection {
  heading: string
  body: string
}

interface GuideData {
  title: string
  content: string
}

export const GuideDetailPage: React.FC<{ id: string }> = ({ id }) => {
  const [sections, setSections] = useState<ContentSection[]>([])
  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(0)

  const { data: guide, isLoading, isError, error } = useGuideQuery(id)

  const errorMessage = isError
    ? isApiError(error)
      ? error.message
      : error instanceof Error
        ? error.message
        : 'An error occurred while loading this guide.'
    : null

  const sectionReferences = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!guide) {
      setSections([])
      return
    }

    const guideData = guide as GuideData
    if (!guideData.content) {
      setSections([])
      return
    }

    try {
      const parsed =
        typeof guideData.content === 'string'
          ? JSON.parse(guideData.content)
          : guideData.content

      if (Array.isArray(parsed)) {
        setSections(parsed as ContentSection[])
      } else if (
        parsed &&
        typeof parsed === 'object' &&
        Array.isArray(parsed.content)
      ) {
        setSections(parsed.content)
      } else {
        setSections([
          { heading: guideData.title, body: String(guideData.content) },
        ])
      }
    } catch (parseError) {
      console.error(parseError)
      setSections([
        { heading: guideData.title, body: String(guideData.content) },
      ])
    }
  }, [guide])

  const handleTocClick = (index: number) => {
    setActiveSectionIndex(index)
    sectionReferences.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-800">
      {/* Main Content */}
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-16 py-10 md:grid-cols-[250px_1fr] md:items-start">
          {/* Sticky Left Navigation Sidebar */}
          <aside className="static top-8 md:sticky">
            <Link
              to="/resources/guides"
              className="mb-6 inline-block text-sm text-neutral-500 transition-colors hover:text-[#09090b]"
            >
              &larr; Go back
            </Link>

            {/* Table of Contents */}
            {sections.length > 0 && (
              <nav
                className="hidden flex-col gap-2 md:flex"
                aria-label="Table of contents"
              >
                {sections.map((section, index) => {
                  const isActive = index === activeSectionIndex
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleTocClick(index)}
                      className={`block pl-2 text-left text-sm transition-colors duration-150 ${
                        isActive
                          ? 'font-semibold text-[#09090b]'
                          : 'font-normal text-neutral-500 hover:text-[#09090b]'
                      }`}
                    >
                      {isActive && '~ '}
                      {section.heading}
                    </button>
                  )
                })}
              </nav>
            )}
          </aside>

          <article className="w-full max-w-full md:max-w-170">
            {isLoading ? (
              <div className="py-12 text-center text-neutral-500">
                <p className="animate-pulse">Loading guide information...</p>
              </div>
            ) : errorMessage ? (
              <div>
                <h1 className="mb-10 font-serif text-3xl leading-tight font-normal text-[#09090b] md:text-4xl">
                  Guide not found
                </h1>
                <div className="text-base text-neutral-500">
                  <p>{errorMessage}</p>
                </div>
              </div>
            ) : (
              <>
                <h1 className="mb-10 font-serif text-3xl leading-tight font-normal text-[#09090b] md:text-4xl">
                  {guide?.title}
                </h1>

                <div className="w-full">
                  {sections.length === 0 ? (
                    <p className="text-base leading-relaxed text-neutral-500">
                      Full content for this guide is coming soon.
                    </p>
                  ) : (
                    sections.map((section, index) => (
                      <div
                        key={index}
                        ref={(element) => {
                          sectionReferences.current[index] = element
                        }}
                        className="mb-8 scroll-mt-8"
                      >
                        <h2 className="mb-3 text-base font-semibold text-[#09090b]">
                          {section.heading}
                        </h2>
                        <p className="text-base leading-relaxed text-[#403f46]">
                          {section.body}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </article>
        </div>
      </div>
    </div>
  )
}

export default GuideDetailPage
