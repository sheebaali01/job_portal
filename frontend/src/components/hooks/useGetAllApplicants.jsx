import { setAllApplicants } from '@/redux/applicationSlice';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';

const useGetAllApplicants = (jobId) => {
    const dispatch = useDispatch();
    // const {searchCompanyByText} = useSelector(store=>store.company);
    useEffect(()=>{
        const fetchAllApplicants = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${jobId}/applicants`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setAllApplicants(res.data.job));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllApplicants();
    },[])
}

export default useGetAllApplicants