import { useState, useEffect } from 'react';
import api from '../../api/atividade';
import { Button, Modal } from 'react-bootstrap';
import AtividadeLista from './AtividadeLista';
import AtividadeForm from './AtividadeForm';
import TitlePage from '../../components/TitlePage';

export default function Atividade() {
  const [showAtividadeMdal, setShowAtividadeModal] = useState(false);
  const [smShowConfirmModal, setSmShowConfirmModal] = useState(false);

  const handleAtividadeModal = () => setShowAtividadeModal(!showAtividadeMdal);

  const handleConfirmModal = (id) => {
    if (id !== 0 && id !== undefined) {
      const atividade = atividades.filter
        (atividade => atividade.id === id
        );
      setAtividade(atividade[0]);
    } else {
      setAtividade({ id: 0 });
    }
    setSmShowConfirmModal(!smShowConfirmModal);
  };



  const [atividades, setAtividades] = useState([]);
  const [atividade, setAtividade] = useState({ id: 0 });

  const pegaTodasAtividades = async () => {
    const response = await api.get('atividade');
    return response.data;
  }

  useEffect(() => {
    const getAtividades = async () => {
      const todasAtividades = await pegaTodasAtividades();
      if (todasAtividades) setAtividades(todasAtividades);
    };
    getAtividades();
  }, [])


  const addAtividade = async (ativ) => {
    handleAtividadeModal();
    const response = await api.post('atividade', ativ);
    console.log(response.data);
    setAtividades([...atividades, response.data]);
  }

  const novaAtividade = () => {
    setAtividade({ id: 0 });
    handleAtividadeModal();
  }

  const excluir = async (id) => {
    handleConfirmModal(0);
    if (await api.delete(`atividade/${id}`)) {
      const atividadesFiltradas = atividades.filter(atividade => atividade.id !== id);
      setAtividades([...atividadesFiltradas]);
    }
  }

  function editar(id) {
    const atividade = atividades.filter(atividade => atividade.id === id);
    setAtividade(atividade[0]);
    handleAtividadeModal();
  }

  function cancelarAtividade() {
    setAtividade({ id: 0 });
    handleAtividadeModal();
  }

  const atualizarAtividade = async (ativ) => {
    handleAtividadeModal();
    const response = await api.put(`atividade/${ativ.id}`, ativ);
    const { id } = response.data;
    setAtividades(
      atividades.map((item) => (item.id === id ? response.data : item))
    );
    setAtividade({ id: 0 });
  }

  return (
    <>
      <TitlePage title={'Atividade ' + (atividade.id !== 0 ? atividade.id : '')}>
        <Button variant="outline-secondary" onClick={novaAtividade}>
          <i className='fas fa-plus'></i>
        </Button>
      </TitlePage>
      <AtividadeLista
        atividades={atividades}
        handleConfirmModal={handleConfirmModal}
        editar={editar}
      ></AtividadeLista>

      <Modal show={showAtividadeMdal} onHide={handleAtividadeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Atividade {atividade.id !== 0 ? atividade.id : ''}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AtividadeForm
            addAtividade={addAtividade}
            cancelarAtividade={cancelarAtividade}
            atualizarAtividade={atualizarAtividade}
            atividadeSelecionada={atividade}
            atividades={atividades}
          ></AtividadeForm>
        </Modal.Body>
      </Modal>

      <Modal
        size='sm'
        show={smShowConfirmModal}
        onHide={handleConfirmModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Excluindo Atividade{''}
            {atividade.id !== 0 ? atividade.id : ''}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir a Atividade {atividade.id}
        </Modal.Body>
        <Modal.Footer className='d-flex justify-content-between'>
          <Button className='btn btn-success me-2' onClick={() => excluir(atividade.id)}>
            <i className='fas fa-check me-2'></i>
            Sim
          </Button>
          <Button className='btn btn-danger me-2' onClick={() => handleConfirmModal(0)}>
            <i className='fas fa-times me-2'></i>
            Não
          </Button>
        </Modal.Footer>
      </Modal>


    </>
  );
}


