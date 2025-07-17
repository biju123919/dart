import { Environment } from "./environment.model";

export const environment: Environment = {
    production: false,
    name: 'local',
    baseUrl: 'https://localhost:4200'
}

// export interface Environment {
//     production: boolean;
//     name: string;
//     baseUrl: string;
// }

// export const environment: Environment = {
//     production: false,
//     name: 'local',
//     baseUrl: 'https://localhost:4200'
// };