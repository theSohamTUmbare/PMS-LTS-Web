import Select, { SingleValue } from 'react-select';
import countryList from 'react-select-country-list';
import { useState } from 'react';

interface CountrySelectorProps {
  handleChange: (event: { target: { name: string; value: string } }) => void;
}

interface OptionType {
  value: string;
  label: string;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({ handleChange }) => {
  const options = countryList().getData();
  const [selectedCountry, setSelectedCountry] = useState<OptionType | null>(null);

  const handleCountryChange = (selectedOption: SingleValue<OptionType>) => {
    if (selectedOption) {
      setSelectedCountry(selectedOption);
      handleChange({ target: { name: 'national_id', value: selectedOption.label } });
    }
  };

  const customStyles = {
    menu: (provided: any) => ({
      ...provided,
      maxHeight: '200px', // You can adjust this value to set the dropdown height
      overflowY: 'auto',  // Ensures scrolling if the dropdown exceeds the maxHeight
    }),
  };

  return (
    <>
      <label className="block text-gray-700 text-sm font-semibold mb-1">
        Nationality
      </label>
      <Select
        options={options}
        value={selectedCountry}
        onChange={handleCountryChange}
        placeholder="Select Country"
        className="w-full"
        styles={customStyles}
      />
    </>
  );
};

export default CountrySelector;
