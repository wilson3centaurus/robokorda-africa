"use client";

import { useState } from "react";
import { CourseCard } from "@/components/course-card";
import { CourseInquiryModal } from "@/components/course-inquiry-modal";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";
import type { Course } from "@/data/site";

export function CoursesSection({ courses }: { courses: Course[] }) {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  return (
    <section id="courses" className="section-anchor section-space circuit-bg">
      <div className="section-shell">
        <Reveal>
          <SectionHeader
            eyebrow="Our Courses"
            title="Structured learning pathways from beginner coding to advanced robotics."
            description="Covering robotics, coding, AI, and app development for learners aged 8–17 and vocational trainees — delivered across school timetables, clubs, and weekend programmes."
          />
        </Reveal>

        {/* Mobile: horizontal scroll strip */}
        <div className="mt-10 -mx-4 sm:mx-0">
          <div className="flex gap-4 overflow-x-auto px-4 pb-4 sm:hidden snap-x snap-mandatory scroll-smooth">
            {courses.map((course) => (
              <div key={course.title} className="w-72 flex-none snap-start">
                <CourseCard course={course} onEnquire={setSelectedCourse} />
              </div>
            ))}
          </div>

          {/* Tablet+: grid */}
          <div className="hidden sm:grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map((course, index) => (
              <Reveal key={course.title} delay={index * 0.04}>
                <CourseCard course={course} onEnquire={setSelectedCourse} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <CourseInquiryModal
        courseTitle={selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />
    </section>
  );
}
