import React, { useState, useEffect } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { ArrowLeftShort } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';

import { getBettingMachine, updateBettingMachine } from '../../services/bettingMachineService';
import { BettingMachineForm } from './BettingMachineForm';
import Spinner from '../../components/common/Spinner';

const EditBettingMachinePage = (props) => {
  const [bettingMachine, setBettingMachine] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  let { id: bettingMachineID } = props.match.params;

  const fetchBettingMachine = async (bettingMachineID) => {
    setLoading(true);
    try {
      const bettingMachine = await getBettingMachine(bettingMachineID);
      setBettingMachine(bettingMachine);
    } catch (error) {
      error.response && setError(error.response.data);
      console.log(error.response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBettingMachine(bettingMachineID);
  }, [bettingMachineID]);

  const onSubmit = async (formData) => {
    setSubmitLoading(true);
    try {
      const updatedBettingMachine = await updateBettingMachine(bettingMachineID, formData);
      setBettingMachine(updatedBettingMachine);

      toast.success(`Kladomat ${updatedBettingMachine.number} je uspješno ažuriran.`);
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
      <h2 className='mb-4 text-primary'>Uredi kladomat {bettingMachine && bettingMachine.place}</h2>
      {error && <Alert variant='danger'>{error}</Alert>}
      <BettingMachineForm defaultValues={bettingMachine} onSubmit={onSubmit} submitLoading={submitLoading} />
    </div>
  );
};

export default EditBettingMachinePage;
