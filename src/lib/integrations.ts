export enum Integrations {
  Cronjob = 'Cronjob',
  Discord = 'Discord',
  Email = 'Email',
}

export type IntegrationDetails = {
  name: string;
  description: string;
  icon: string;
  image: string;
  type: 'Action' | 'Trigger';
};
export type IntegrationDetailsType = Record<Integrations, IntegrationDetails>;
