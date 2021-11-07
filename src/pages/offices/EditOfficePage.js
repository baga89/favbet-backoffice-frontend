import React, { useState, useEffect } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { ArrowLeftShort } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { format, parseISO } from 'date-fns';

import { getOffice, updateOffice } from '../../services/officeService';
import { OfficeForm } from './OfficeForm';
import Spinner from '../../components/common/Spinner';

const EditOfficePage = (props) => {
  const [office, setOffice] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  let { id: officeID } = props.match.params;

  const fetchOffice = async (officeID) => {
    setLoading(true);
    try {
      const office = await getOffice(officeID);
      // office.obligationsFrom = office.obligationsFrom.substring(0, 10);
      setOffice(office);
    } catch (error) {
      error.response && setError(error.response.data);
      console.log(error.response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffice(officeID);
  }, [officeID]);

  const onSubmit = async (formData) => {
    setSubmitLoading(true);
    try {
      const updatedOffice = await updateOffice(officeID, formData);
      setOffice(updatedOffice);

      // setOffice((office) => {
      //   return { ...office, ...updatedOffice };
      // });

      // setOffice({ ...office, ...updatedOffice });

      toast.success(`Poslovnica ${updatedOffice.number} je uspješno ažurirana.`);
    } catch (error) {
      error.response && setError(error.response.data);
      console.log(error.response);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className='fav-container'>
      <Button onClick={props.history.goBack} variant='light' className='mb-4'>
        <ArrowLeftShort className='me-2' size={24} />
        Idi nazad
      </Button>
      <h2 className='mb-4 text-primary'>Uredi poslovnicu {office && office.place}</h2>
      {error && <Alert variant='danger'>{error}</Alert>}
      <OfficeForm defaultValues={office} onSubmit={onSubmit} submitLoading={submitLoading} />
    </div>
  );
};

export default EditOfficePage;
