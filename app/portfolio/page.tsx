import type { Metadata } from 'next';
import Image from 'next/image';
import type { IconType } from 'react-icons';
import { SiExpo, SiReact } from 'react-icons/si';
import * as s from './portfolio.css';

export const metadata: Metadata = {
  title: '포트폴리오',
  description: '프론트엔드 개발자 임재준의 기술 스택과 활동 이력입니다.',
  openGraph: {
    title: '포트폴리오',
    description: '프론트엔드 개발자 임재준의 기술 스택과 활동 이력입니다.',
  },
};

interface TechStackItem {
  id: string;
  name: string;
  icon: IconType;
  iconColor: string;
}

interface ActivityGroup {
  id: string;
  organization: string;
  roles: string[];
}

const techStackItems: TechStackItem[] = [
  { id: 'react', name: 'React', icon: SiReact, iconColor: '#38bdf8' },
  {
    id: 'react-native',
    name: 'React Native',
    icon: SiReact,
    iconColor: '#7dd3fc',
  },
  { id: 'expo', name: 'Expo', icon: SiExpo, iconColor: '#ffffff' },
];

const activityGroups: ActivityGroup[] = [
  {
    id: 'likelion',
    organization: '멋쟁이사자처럼',
    roles: ['13기 멤버', '14기 프론트엔드 운영진'],
  },
  {
    id: 'gdg-on-hufs',
    organization: 'GDG on HUFS',
    roles: ['6기 멤버', '7기 코어멤버'],
  },
];

export default function PortfolioPage() {
  return (
    <main className={s.main}>
      <h1 className={s.pageTitle}>포트폴리오</h1>

      <section className={s.profileCard}>
        <div className={s.profileGrid}>
          <div className={s.logoWrapper}>
            <Image
              src='/images/logo.png'
              alt='포트폴리오 프로필 로고'
              width={144}
              height={144}
              className={s.logoImg}
              priority
            />
          </div>
          <div className={s.profileInfo}>
            <p className={s.profileLabel}>Portfolio Profile</p>
            <p className={s.profileName}>프론트엔드 개발자 임재준</p>
          </div>
        </div>
      </section>

      <section className={s.contentGrid}>
        <article className={s.sectionCard}>
          <h2 className={s.sectionTitle}>기술 스택</h2>
          <ul className={s.stackList}>
            {techStackItems.map((stack) => {
              const StackIcon = stack.icon;
              return (
                <li
                  key={stack.id}
                  className={s.stackItem}>
                  <span className={s.iconWrapper}>
                    <StackIcon
                      aria-hidden='true'
                      style={{ color: stack.iconColor }}
                    />
                  </span>
                  <strong className={s.stackName}>{stack.name}</strong>
                </li>
              );
            })}
          </ul>
        </article>

        <article className={s.sectionCard}>
          <h2 className={s.sectionTitle}>활동</h2>
          <div className={s.activityList}>
            {activityGroups.map((group) => (
              <section
                key={group.id}
                className={s.activityGroup}>
                <h3 className={s.orgLabel}>{group.organization}</h3>
                <ul className={s.roleList}>
                  {group.roles.map((role) => (
                    <li
                      key={role}
                      className={s.roleItem}>
                      {role}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
