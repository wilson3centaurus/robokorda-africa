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
    <section id="courses" className="section-anchor section-space">
      <div className="section-shell">
        <Reveal>
          <SectionHeader
            eyebrow="Our Courses"
            title="Structured learning pathways from beginner coding to advanced robotics."
            description="Covering robotics, coding, AI, and app development for learners aged 8–17 and vocational trainees — delivered across school timetables, clubs, and weekend programmes."
          />
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course, index) => (
            <Reveal key={course.title} delay={index * 0.04}>
              <CourseCard course={course} onEnquire={setSelectedCourse} />
            </Reveal>
          ))}
        </div>
      </div>

      <CourseInquiryModal
        courseTitle={selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />
    </section>
  );
}
