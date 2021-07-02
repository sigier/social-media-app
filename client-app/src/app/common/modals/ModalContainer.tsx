import { observer } from "mobx-react-lite";
import { Modal } from "semantic-ui-react";
import { useStore } from "../../stores/store";


function  ModalContainer() {

    const { modalStore } = useStore();

    return (

        <Modal 
         onClose={modalStore.closeModal}
         open={modalStore.modal.open}
         size='mini'
        >
            <Modal.Content>
                { modalStore.modal.body }
            </Modal.Content >
        </Modal>
    )
};

export default observer(ModalContainer);