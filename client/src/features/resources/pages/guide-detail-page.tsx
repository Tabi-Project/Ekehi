import { Link } from '@tanstack/react-router'
import React, { useEffect, useRef, useState } from 'react'

import { Skeleton } from '#/components/ui/skeleton'

import { useGuideQuery } from '../resources.query'

interface ContentSection {
  heading: string
  body: string
}

interface GuideData {
  title: string
  content: string
}

export const GuideDetailPage: React.FC<{ idOrSlug: string }> = ({
  idOrSlug,
}) => {
  const [sections, setSections] = useState<ContentSection[]>([])
  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(0)

  const { data: guide, isLoading, isError, error } = useGuideQuery(idOrSlug)

  const errorMessage = isError
    ? error.message || 'An error occurred while loading this guide.'
    : null

  const sectionReferences = useRef<(HTMLDivElement | null)[]>([])
  const isScrollingRef = useRef(false)

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

  useEffect(() => {
    if (sections.length === 0 || typeof IntersectionObserver === 'undefined')
      return

    const observerOptions = {
      root: null,
      rootMargin: '-15% 0px -75% 0px',
      threshold: 0,
    }

    const observer = new IntersectionObserver((entries) => {
      if (isScrollingRef.current) return

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sectionReferences.current.indexOf(
            entry.target as HTMLDivElement,
          )
          if (index !== -1) {
            setActiveSectionIndex(index)
          }
        }
      })
    }, observerOptions)

    // eslint-disable-next-line unicorn/prevent-abbreviations
    const currentRefs = [...sectionReferences.current]
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => {
      currentRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref)
      })
      observer.disconnect()
    }
  }, [sections])

  const handleTocClick = (index: number) => {
    isScrollingRef.current = true
    setActiveSectionIndex(index)
    sectionReferences.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
    setTimeout(() => {
      isScrollingRef.current = false
    }, 800)
  }

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-800">
      {/* Main Content */}
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-16 py-10 md:grid-cols-[250px_1fr] md:items-start">
          {/* Sticky Left Navigation Sidebar */}
          <aside className="static top-24 md:sticky md:top-24">
            <Link
              to="/resources/guides"
              className="mb-6 inline-block text-sm text-neutral-500 transition-colors hover:text-[#09090b]"
            >
              &larr; Go back
            </Link>

            {/* Table of Contents */}
            {isLoading ? (
              <div
                role="status"
                aria-label="Loading table of contents"
                className="mt-6 hidden flex-col gap-3 md:flex"
              >
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-28" />
              </div>
            ) : sections.length > 0 ? (
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
                      {isActive && <span className="text-primary mr-1">-</span>}
                      {section.heading}
                    </button>
                  )
                })}
              </nav>
            ) : null}
          </aside>

          <article className="w-full max-w-full md:max-w-170">
            {isLoading ? (
              <div
                role="status"
                aria-label="Loading guide content"
                className="flex flex-col gap-8"
              >
                {/* Title skeleton */}
                <Skeleton className="mb-4 h-10 w-3/4" />

                {/* Section 1 */}
                <div className="flex flex-col gap-3">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>

                {/* Section 2 */}
                <div className="flex flex-col gap-3">
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>

                {/* Section 3 */}
                <div className="flex flex-col gap-3">
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>

                {/* Section 4 */}
                <div className="flex flex-col gap-3">
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
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
