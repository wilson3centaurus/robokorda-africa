'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ImagePicker from '@/components/admin/image-picker';
import {
  ArrowLeft,
  Save,
  ChevronDown,
  ChevronRight,
  ImageIcon,
  Type,
  Plus,
  Trash2,
  Check,
  Film,
  Undo2,
} from 'lucide-react';

/* ---------- default data for each page ---------- */

const DEFAULTS: Record<string, Record<string, SectionItem[]>> = {
  home: {
    'Hero Stats': [
      { label: 'Students Trained', value: '9,976+', type: 'stat' },
      { label: 'Schools Reached', value: '79+', type: 'stat' },
      { label: 'Countries', value: '11', type: 'stat' },
      { label: 'Competitions Won', value: '31', type: 'stat' },
    ],
    'Hero Video': [
      { label: 'Video URL', value: '/media/home-hero.mp4', type: 'video' },
    ],
    'Delivery Options': [
      { label: 'School Curriculum', value: 'Robokorda embeds robotics and coding into the formal timetable with structured lesson plans and progress tracking.', imageSrc: 'https://picsum.photos/seed/curriculum-delivery/1200/900', type: 'card' },
      { label: 'Extra-Curricular', value: 'After-school robotics clubs give learners a premium innovation space beyond core lessons while staying connected to school life.', imageSrc: 'https://picsum.photos/seed/extracurricular-delivery/1200/900', type: 'card' },
      { label: 'Weekend Programmes', value: 'Weekend cohorts open the Robokorda pathway to families, homeschool communities, and learners outside partner schools.', imageSrc: 'https://picsum.photos/seed/weekend-delivery/1200/900', type: 'card' },
    ],
    'Courses': [
      { label: 'Foundations of Robotics', value: 'Ages 8-11 · 10 Weeks', imageSrc: 'https://picsum.photos/seed/foundations-robotics/900/720', type: 'card' },
      { label: 'Scratch Logic Lab', value: 'Ages 8-13 · 12 Weeks', imageSrc: 'https://picsum.photos/seed/scratch-logic-lab/900/720', type: 'card' },
      { label: 'App Studio for Young Innovators', value: 'Ages 10-15 · 12 Weeks', imageSrc: 'https://picsum.photos/seed/app-studio-young-innovators/900/720', type: 'card' },
      { label: 'AI Explorer Track', value: 'Ages 12-17 · 8 Weeks', imageSrc: 'https://picsum.photos/seed/ai-explorer-track/900/720', type: 'card' },
      { label: 'Electronics and Sensors', value: 'Ages 11-17 · 10 Weeks', imageSrc: 'https://picsum.photos/seed/electronics-sensors/900/720', type: 'card' },
      { label: 'Mechanical Design Studio', value: 'Ages 10-17 · 10 Weeks', imageSrc: 'https://picsum.photos/seed/mechanical-design-studio/900/720', type: 'card' },
    ],
    'Partners': [
      { label: 'Independent and private schools', value: 'Schools looking to strengthen practical robotics, coding, and innovation pathways.', imageSrc: 'https://picsum.photos/seed/private-schools-partner/900/720', type: 'card' },
      { label: 'Public school networks', value: 'Districts and school groups building wider access to technology education.', imageSrc: 'https://picsum.photos/seed/public-school-networks/900/720', type: 'card' },
      { label: 'NGOs and development partners', value: 'Organisations focused on youth capability, digital inclusion.', imageSrc: 'https://picsum.photos/seed/ngo-development-partners/900/720', type: 'card' },
      { label: 'Teacher enablement programmes', value: 'Partners seeking school adoption support.', imageSrc: 'https://picsum.photos/seed/teacher-enablement/900/720', type: 'card' },
      { label: 'Innovation hubs and universities', value: 'Institutions that want stronger junior innovation pipelines.', imageSrc: 'https://picsum.photos/seed/innovation-hubs-universities/900/720', type: 'card' },
      { label: 'Parent and homeschool communities', value: 'Families seeking structured technology learning.', imageSrc: 'https://picsum.photos/seed/parent-communities/900/720', type: 'card' },
    ],
    'Gallery': [
      { label: 'Classroom robotics sprint', value: 'Learners work through guided assembly and testing sessions.', imageSrc: 'https://picsum.photos/seed/gallery-classroom-robotics/1200/900', type: 'card' },
      { label: 'Young coders at work', value: 'Block-based logic activities help students connect creativity.', imageSrc: 'https://picsum.photos/seed/gallery-young-coders/900/900', type: 'card' },
      { label: 'Prototype review table', value: 'Project feedback sessions encourage iteration.', imageSrc: 'https://picsum.photos/seed/gallery-prototype-review/900/1200', type: 'card' },
      { label: 'Weekend innovation studio', value: 'Families and learners use weekend sessions.', imageSrc: 'https://picsum.photos/seed/gallery-weekend-studio/1200/900', type: 'card' },
      { label: 'Competition rehearsal', value: 'Teams prepare for timed presentations.', imageSrc: 'https://picsum.photos/seed/gallery-competition-rehearsal/900/900', type: 'card' },
      { label: 'Electronics testing bench', value: 'Hands-on circuit work sharpens troubleshooting.', imageSrc: 'https://picsum.photos/seed/gallery-electronics-bench/900/900', type: 'card' },
      { label: 'School showcase day', value: 'Learners present finished projects to educators.', imageSrc: 'https://picsum.photos/seed/gallery-showcase-day/900/1200', type: 'card' },
    ],
  },
  rirc: {
    'Competition Tracks': [
      { label: 'Robot Design Challenge', value: 'Teams build, test, and present autonomous robotics solutions under timed challenge conditions.', type: 'text' },
      { label: 'AI Innovation Track', value: 'Participants design practical AI-supported ideas that solve real community problems.', type: 'text' },
      { label: 'Sustainable Tech Showcase', value: 'Teams present prototypes responding to sustainability, energy, agriculture needs.', type: 'text' },
    ],
    'Countries': [
      { label: 'Botswana', value: 'bw', type: 'text' },
      { label: 'DR Congo', value: 'cd', type: 'text' },
      { label: 'Ghana', value: 'gh', type: 'text' },
      { label: 'Malawi', value: 'mw', type: 'text' },
      { label: 'Mozambique', value: 'mz', type: 'text' },
      { label: 'Namibia', value: 'na', type: 'text' },
      { label: 'South Africa', value: 'za', type: 'text' },
      { label: 'Zambia', value: 'zm', type: 'text' },
      { label: 'Zimbabwe', value: 'zw', type: 'text' },
    ],
    'Winners': [
      { label: 'Team Robo-Underdogs', value: 'Zimbabwe · Overall Winners · Built an underwater drone.', imageSrc: '/images/rirc/winner-team.jpg', type: 'card' },
      { label: 'Robo-gurus', value: 'Ghana · First Place Beginner Level · Won 4/5 challenges.', imageSrc: '/images/rirc/beginner-winner.jpg', type: 'card' },
      { label: 'Team Cyberflacx', value: 'Zimbabwe · 1st Place Makerthon · Innovation Award.', imageSrc: '/images/rirc/makerthon.jpg', type: 'card' },
    ],
    'Gallery': [
      { label: 'Hon. Prof. Torerayi Moyo', value: 'Encouraging students to invest more in sustainable innovation.', imageSrc: '/images/rirc/minister.jpg', type: 'card' },
      { label: 'Robot pit lane', value: 'Final calibration before judging.', imageSrc: 'https://picsum.photos/seed/rirc-pit-lane/900/900', type: 'card' },
      { label: 'Judges review table', value: 'Technical judges reviewed prototypes.', imageSrc: 'https://picsum.photos/seed/rirc-judges-review/900/1200', type: 'card' },
      { label: 'AI track presentation', value: 'Learners pitched scalable ideas.', imageSrc: 'https://picsum.photos/seed/rirc-ai-track/900/900', type: 'card' },
      { label: 'Design challenge finals', value: 'Highest-scoring robotics run.', imageSrc: 'https://picsum.photos/seed/rirc-design-finals/1200/900', type: 'card' },
      { label: 'Award ceremony', value: 'Winning teams received medals.', imageSrc: 'https://picsum.photos/seed/rirc-award-ceremony/900/900', type: 'card' },
    ],
    'Prizes': [
      { label: '1st Place', value: 'RIRC Overall Winners Shield · Qualifies for Technoxian India', type: 'text' },
      { label: '2nd Place', value: 'RIRC Second Position Shield · Tablets + Certificates', type: 'text' },
      { label: '3rd Position', value: 'RIRC Third Position Shield · Robotics Kits + Certificates', type: 'text' },
    ],
  },
  'prime-book': {
    'Product Specs': [
      { label: 'Processor', value: 'Intel Core i5', type: 'text' },
      { label: 'RAM', value: '8GB', type: 'text' },
      { label: 'Storage', value: '256GB SSD', type: 'text' },
      { label: 'Display', value: '14" FHD', type: 'text' },
      { label: 'Battery', value: '10hrs', type: 'text' },
      { label: 'OS', value: 'Windows 11 Pro', type: 'text' },
    ],
    'Features': [
      { label: 'Performance', value: 'Responsive daily computing for classroom software, office tasks, coding environments.', type: 'text' },
      { label: 'Portability', value: 'Slim enough for school bags and field visits.', type: 'text' },
      { label: 'Battery Life', value: 'Designed to last through long school days.', type: 'text' },
      { label: 'Classroom Ready', value: 'Configured for learning environments with durable build quality.', type: 'text' },
      { label: 'Business Productivity', value: 'A practical option for teachers, administrators, founders.', type: 'text' },
      { label: 'Durability', value: 'Built to handle active use across schools, training centres.', type: 'text' },
    ],
    'Gallery': [
      { label: 'Student coding session', value: 'Prime Book used in a practical software lesson.', imageSrc: 'https://picsum.photos/seed/prime-gallery-student-coding/900/900', type: 'card' },
      { label: 'Campus mobility', value: 'Portable enough for classrooms, labs, and libraries.', imageSrc: 'https://picsum.photos/seed/prime-gallery-campus-mobility/900/1200', type: 'card' },
      { label: 'Teacher workstation', value: 'Reliable for planning, reporting, and lesson delivery.', imageSrc: 'https://picsum.photos/seed/prime-gallery-teacher-workstation/1200/900', type: 'card' },
      { label: 'Business workspace', value: 'A clean device for everyday productivity.', imageSrc: 'https://picsum.photos/seed/prime-gallery-business-workspace/900/900', type: 'card' },
      { label: 'School deployment stack', value: 'Bulk rollouts for schools supported.', imageSrc: 'https://picsum.photos/seed/prime-gallery-school-deployment/900/900', type: 'card' },
      { label: 'Study on the move', value: 'Useful in libraries, study halls, and travel.', imageSrc: 'https://picsum.photos/seed/prime-gallery-study-on-the-move/900/1200', type: 'card' },
      { label: 'Presentation mode', value: 'Strong enough for pitches and online meetings.', imageSrc: 'https://picsum.photos/seed/prime-gallery-presentation-mode/1200/900', type: 'card' },
      { label: 'Everyday productivity', value: 'Built for spreadsheets, browsing, document work.', imageSrc: 'https://picsum.photos/seed/prime-gallery-productivity/900/900', type: 'card' },
    ],
    'Pricing': [
      { label: 'Student Pack', value: '$299 · 4GB RAM · 128GB SSD · Basic accessories', type: 'text' },
      { label: 'Standard Pack', value: '$399 · 8GB RAM · 256GB SSD · Carry bag', type: 'text' },
      { label: 'Pro Pack', value: '$549 · 16GB RAM · 512GB SSD · Full business kit', type: 'text' },
    ],
    'FAQs': [
      { label: 'Is the Prime Book suitable for students?', value: 'Yes. Prime Book is intentionally positioned as an affordable, rugged, education-focused laptop.', type: 'text' },
      { label: 'What warranty is included?', value: 'Prime Book includes a 1-year warranty with support coordination.', type: 'text' },
      { label: 'Can schools order in bulk?', value: 'Yes. Volume pricing and deployment support are available.', type: 'text' },
    ],
  },
  shop: {
    'Products': [
      { label: 'Prime Book Student 14', value: '$299 · A dependable education-focused laptop.', imageSrc: 'https://picsum.photos/seed/prime-book-student/900/720', type: 'card' },
      { label: 'Prime Book Standard 14', value: '$399 · Balanced performance for schools and tutors.', imageSrc: 'https://picsum.photos/seed/prime-book-standard/900/720', type: 'card' },
      { label: 'Robotics Starter Lab Kit', value: '$179 · Starter hardware and build guides.', imageSrc: 'https://picsum.photos/seed/robotics-starter-lab/900/720', type: 'card' },
      { label: 'Classroom Sensor Pack', value: '$79 · Distance, light, and motion sensors.', imageSrc: 'https://picsum.photos/seed/classroom-sensor-pack/900/720', type: 'card' },
      { label: 'Microcontroller Duo Bundle', value: '$112 · Two classroom-friendly boards.', imageSrc: 'https://picsum.photos/seed/microcontroller-duo/900/720', type: 'card' },
      { label: 'Electronics Practice Bundle', value: '$68 · Breadboards, resistors, LEDs.', imageSrc: 'https://picsum.photos/seed/electronics-practice-bundle/900/720', type: 'card' },
      { label: 'RIRC Practice Competition Mat', value: '$145 · Durable practice surface.', imageSrc: 'https://picsum.photos/seed/rirc-competition-mat/900/720', type: 'card' },
      { label: 'Coding Workbook Pack', value: '$54 · Printed learner journals.', imageSrc: 'https://picsum.photos/seed/coding-workbook-pack/900/720', type: 'card' },
      { label: 'AI Vision Camera Module', value: '$129 · Entry point into computer vision.', imageSrc: 'https://picsum.photos/seed/ai-camera-module/900/720', type: 'card' },
    ],
  },
};

const PAGE_LABELS: Record<string, string> = {
  home: 'Homepage',
  rirc: 'RIRC Competition',
  'prime-book': 'Prime Book',
  shop: 'Shop',
};

/* ---------- types ---------- */

interface SectionItem {
  label: string;
  value: string;
  imageSrc?: string;
  type: 'text' | 'card' | 'stat' | 'video';
}

type ContentData = Record<string, SectionItem[]>;

/* ---------- component ---------- */

export default function PageEditor() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [content, setContent] = useState<ContentData>({});
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<{ section: string; index: number } | null>(null);
  const [pickerType, setPickerType] = useState<'image' | 'video'>('image');

  const defaults = DEFAULTS[slug] || {};
  const pageLabel = PAGE_LABELS[slug] || slug;

  const loadContent = useCallback(async () => {
    try {
      const r = await fetch(`/api/admin/content?page=${slug}`);
      const d = await r.json();
      if (d.content && Object.keys(d.content).length > 0) {
        setContent(d.content);
      } else {
        setContent(defaults);
      }
    } catch {
      setContent(defaults);
    }
    // Open first section by default
    const sectionNames = Object.keys(defaults);
    if (sectionNames.length > 0) setOpenSections(new Set([sectionNames[0]]));
  }, [slug, defaults]);

  useEffect(() => { loadContent(); }, [loadContent]);

  const toggleSection = (name: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  };

  const updateItem = (section: string, index: number, field: 'label' | 'value' | 'imageSrc', val: string) => {
    setContent(prev => {
      const updated = { ...prev };
      const items = [...(updated[section] || [])];
      items[index] = { ...items[index], [field]: val };
      updated[section] = items;
      return updated;
    });
    setSaved(false);
  };

  const addItem = (section: string) => {
    const sample = content[section]?.[0];
    const newItem: SectionItem = {
      label: 'New item',
      value: '',
      type: sample?.type || 'text',
      ...(sample?.imageSrc !== undefined ? { imageSrc: '' } : {}),
    };
    setContent(prev => ({
      ...prev,
      [section]: [...(prev[section] || []), newItem],
    }));
    setSaved(false);
  };

  const removeItem = (section: string, index: number) => {
    if (!confirm('Remove this item?')) return;
    setContent(prev => ({
      ...prev,
      [section]: (prev[section] || []).filter((_, i) => i !== index),
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const r = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: slug, content }),
      });
      if (r.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else alert('Failed to save');
    } catch { alert('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleReset = () => {
    if (!confirm('Reset all changes to defaults? This will discard your edits.')) return;
    setContent(defaults);
    setSaved(false);
  };

  const openImagePicker = (section: string, index: number, type: 'image' | 'video' = 'image') => {
    setPickerTarget({ section, index });
    setPickerType(type);
    setPickerOpen(true);
  };

  const handlePickerSelect = (path: string) => {
    if (pickerTarget) {
      const field = pickerType === 'video' ? 'value' : 'imageSrc';
      updateItem(pickerTarget.section, pickerTarget.index, field, path);
    }
  };

  const sections = Object.keys(content).length > 0 ? Object.keys(content) : Object.keys(defaults);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/admin/pages')} className="text-slate-400 hover:text-slate-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{pageLabel}</h1>
            <p className="text-sm text-slate-500">{sections.length} sections</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleReset}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-2">
            <Undo2 className="w-4 h-4" /> Reset
          </button>
          <button onClick={handleSave} disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white text-sm rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2">
            {saved ? <><Check className="w-4 h-4" /> Saved</> : saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </div>
      </div>

      {/* Sections */}
      {sections.map(sectionName => {
        const items = content[sectionName] || defaults[sectionName] || [];
        const isOpen = openSections.has(sectionName);
        return (
          <div key={sectionName} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {/* Section header */}
            <button
              onClick={() => toggleSection(sectionName)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition"
            >
              <div className="flex items-center gap-3">
                {isOpen ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                <h2 className="font-semibold text-slate-900">{sectionName}</h2>
                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{items.length} items</span>
              </div>
            </button>

            {/* Section content */}
            {isOpen && (
              <div className="border-t border-slate-100 px-6 py-4 space-y-4">
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 bg-slate-50 rounded-lg group">
                    {/* Image preview */}
                    {(item.type === 'card' && item.imageSrc !== undefined) && (
                      <div className="shrink-0">
                        <button
                          onClick={() => openImagePicker(sectionName, idx)}
                          className="w-24 h-24 rounded-lg bg-slate-200 overflow-hidden relative group/img border-2 border-transparent hover:border-blue-500 transition"
                          title="Click to change image"
                        >
                          {item.imageSrc ? (
                            <img src={item.imageSrc} alt={item.label} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 text-slate-400" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/40 transition flex items-center justify-center opacity-0 group-hover/img:opacity-100">
                            <ImageIcon className="w-6 h-6 text-white" />
                          </div>
                        </button>
                      </div>
                    )}
                    {/* Video preview */}
                    {item.type === 'video' && (
                      <div className="shrink-0">
                        <button
                          onClick={() => openImagePicker(sectionName, idx, 'video')}
                          className="w-24 h-24 rounded-lg bg-slate-800 overflow-hidden relative group/vid border-2 border-transparent hover:border-blue-500 transition flex items-center justify-center"
                          title="Click to change video"
                        >
                          <Film className="w-8 h-8 text-slate-400" />
                          <div className="absolute inset-0 bg-black/0 group-hover/vid:bg-black/40 transition flex items-center justify-center opacity-0 group-hover/vid:opacity-100">
                            <Film className="w-6 h-6 text-white" />
                          </div>
                        </button>
                      </div>
                    )}
                    {/* Fields */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div>
                        <label className="text-xs text-slate-500 flex items-center gap-1">
                          <Type className="w-3 h-3" /> Label
                        </label>
                        <input
                          type="text"
                          value={item.label}
                          onChange={e => updateItem(sectionName, idx, 'label', e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500">Value / Description</label>
                        <textarea
                          value={item.value}
                          onChange={e => updateItem(sectionName, idx, 'value', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none mt-1 resize-none"
                        />
                      </div>
                      {item.imageSrc !== undefined && (
                        <div>
                          <label className="text-xs text-slate-500 flex items-center gap-1">
                            <ImageIcon className="w-3 h-3" /> Image URL
                          </label>
                          <input
                            type="text"
                            value={item.imageSrc || ''}
                            onChange={e => updateItem(sectionName, idx, 'imageSrc', e.target.value)}
                            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none mt-1"
                            placeholder="Click thumbnail or paste URL"
                          />
                        </div>
                      )}
                    </div>
                    {/* Remove */}
                    <button
                      onClick={() => removeItem(sectionName, idx)}
                      className="shrink-0 text-slate-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100 self-start mt-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Add item */}
                <button
                  onClick={() => addItem(sectionName)}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:border-blue-400 hover:text-blue-600 transition"
                >
                  <Plus className="w-4 h-4" /> Add Item
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* Image Picker Modal */}
      <ImagePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handlePickerSelect}
        mediaType={pickerType}
      />
    </div>
  );
}
