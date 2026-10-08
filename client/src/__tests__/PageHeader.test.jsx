import {render,screen} from '@testing-library/react';
import PageHeader from '../components/PageHeader';
test('renders page title and subtitle',()=>{render(<PageHeader title="Products" subtitle="Manage catalogue"/>);expect(screen.getByText('Products')).toBeInTheDocument();expect(screen.getByText('Manage catalogue')).toBeInTheDocument();});
