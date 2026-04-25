'use client';

import { SkillData, SKILLS_LIST } from '@/app/types/sheet';

interface SkillsSectionProps {
	skills: SkillData[];
	onSkillChange: (index: number, field: keyof SkillData, value: string) => void;
}

export default function SkillsSection({ skills, onSkillChange }: SkillsSectionProps) {
	return (
		<div className='form-section'>
			<h2 className='section-title'>⚙️ SKILLS & SPECIALISATIONS</h2>
			<div className='space-y-3'>
				{skills.map((skill, idx) => (
					<div key={idx} className='skill-row'>
						<span className='font-bold min-w-[110px] text-sm uppercase text-leather'>
							{skill.skillName}
						</span>
						<span className='text-xs bg-amber-200/60 px-2 py-1 rounded-full text-stone-700 font-mono'>
							{skill.characteristic}
						</span>
						<div className='flex flex-1 gap-2 flex-wrap'>
							<input
								type='text'
								placeholder='ADV.'
								value={skill.advances}
								onChange={(e) => onSkillChange(idx, 'advances', e.target.value)}
								className='flex-1 min-w-[70px] bg-white border border-amber-300 rounded-full px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gold-dark'
							/>
							<input
								type='text'
								placeholder='TOTAL'
								value={skill.total}
								onChange={(e) => onSkillChange(idx, 'total', e.target.value)}
								className='flex-1 min-w-[70px] bg-white border border-amber-300 rounded-full px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gold-dark'
							/>
							<input
								type='text'
								placeholder='Specialisation'
								value={skill.specialisation}
								onChange={(e) => onSkillChange(idx, 'specialisation', e.target.value)}
								className='flex-[2] min-w-[120px] bg-white border border-amber-300 rounded-full px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gold-dark'
							/>
						</div>
					</div>
				))}
			</div>
			<div className='text-xs text-stone-500 mt-3 italic'>
				※ Each skill: Advances, Total bonus, and Specialisation text field
			</div>
		</div>
	);
}
