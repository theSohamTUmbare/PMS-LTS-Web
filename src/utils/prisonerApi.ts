import axios from 'axios';

export interface Prisoner {
    prisoner_id: number;
    first_name: string;
    last_name: string;
    date_of_birth: Date;
    gender: string;
    national_id: string;
    entry_date: Date;
    release_date?: Date;
    status: 'Incarcerated' | 'Released' | 'On Trial' | 'Transferred';
    cell_id?: number;
    behavior_record?: object;
    medical_history?: object;
    tracking_device_id?: number;
}

export const getPrisoners = async (): Promise<Prisoner[]> => {
  const response = await axios.get("api/v1/prisoner/all");
  return response.data;
};

export const getPrisonerById = async (id: number): Promise<Prisoner> => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const updatePrisoner = async (id: number, updatedData: Partial<Prisoner>): Promise<Prisoner> => {
  const response = await axios.put(`${BASE_URL}/${id}`, updatedData);
  return response.data;
};

export const deletePrisoner = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};

export const createPrisoner = async (newPrisoner: Prisoner): Promise<Prisoner> => {
  const response = await axios.post(BASE_URL, newPrisoner);
  return response.data;
};
