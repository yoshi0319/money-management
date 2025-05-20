import { useContext } from 'react';
import Menu from './Menu';
import { TabContext } from '@/app/components/layouts/Header/Header';
import AllTerm from './AllTerm';
import SelectedTerm from './SelectedTerm';

export default function Contents() {
  const { tabIndex } = useContext(TabContext);
  return (
    <>
      <Menu />
      {tabIndex === 0 && <AllTerm />}
      {tabIndex === 1 && <SelectedTerm />}
    </>
  );
}
