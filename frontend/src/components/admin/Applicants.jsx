import React from 'react'
import Navbar from '../shared/Navbar'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useGetAllApplicants from '../hooks/useGetAllApplicants'
import ApplicantsTable from './ApplicantsTable'

const Applicants = () => {
    const params = useParams();
    useGetAllApplicants(params.id);
    const {applicants} = useSelector(store=>store.application);

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto'>
                <h1 className='font-bold text-xl my-5'>Applicants {applicants?.applications?.length}</h1>
                <ApplicantsTable />
            </div>
        </div>
    )
}

export default Applicants