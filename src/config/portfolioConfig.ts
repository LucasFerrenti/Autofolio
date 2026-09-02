import { PortfolioConfigOverride } from '../types';

export const githubUsername = 'LucasFerrenti';
export const linkedinUsername = 'ferrenti-lucas';

export const configOverride: PortfolioConfigOverride = {
  profile: {
    githubUsername,
    linkedinUsername,
    name: '',
    headline: '',
    summary: '',
    email: 'lukasferrenti@hotmail.com',
    openToWork: null,
    skills: [],
  },
  settings: {
    onlyCofiguredRepositories: true,
    theme: 'dark',
  },
};
