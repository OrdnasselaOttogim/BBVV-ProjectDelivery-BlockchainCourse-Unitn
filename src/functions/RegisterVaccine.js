import React, { Component } from 'react'
import { Form, Card, Modal, Container, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ErrorModal from '../utils/ErrorModal';

export default class RegisterVaccine extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            showSuccessModal: false,
            showErrorModal: false,
            vaccineRegistry: props.vaccineRegistry
        }
    }

    registerVaccine = async (recipientId, countryCode, vaccineCode) => {
        const recipient = [
            recipientId,
            countryCode
        ];
        this.setState({ loading: true })
        try {
            await this.state.vaccineRegistry.methods.addVaccineToRecipient(recipient, vaccineCode).send({ from: this.props.account });
            this.setState({
                loading: false,
                showSuccessModal: true
            })
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = error.message.split("revert ")[1] || "An error occurred.";
            this.setState({
                loading: false,
                showErrorModal: true,
                modalErrorMessage: errorMessage.split('","stack')[0],
            })
        }
    };

    render() {
        return (
            <div>
                <Container >
                    <Card className="mt-5 shadow">
                        <p className="text-center fs-3 mt-3">Register Vaccine</p>
                    </Card>
                    <Card className="mt-2 p-5 shadow">
                        <Modal show={this.state.showSuccessModal} size="xxl" centered>
                            <Modal.Header closeButton />
                            <Modal.Body><p className='p-2 fs-4 text-center'>Vaccine Registered For Patient</p></Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => {
                                    window.location.reload()
                                    this.setState({ showSuccessModal: false })
                                }}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>
                        <ErrorModal
                            show={this.state.showErrorModal}
                            onClose={() => this.setState({ showErrorModal: false })}
                            errorMessage={this.state.modalErrorMessage}
                        />
                        <Form className='text-center' onSubmit={(event) => {
                            event.preventDefault()
                            const vaccineCode = this.vaccineCode.value
                            const countryCode = this.countryCode.value
                            const recipientId = this.recipientId.value
                            if (recipientId == "")
                                this.setState({ errorMessage: "Recipient Id is required." })
                            else if (countryCode == "")
                                this.setState({ errorMessage: "Country code is required." })
                            else if (vaccineCode == "")
                                this.setState({ errorMessage: "Vaccine code is required." })
                            else {
                                this.setState({ errorMessage: "" })
                                this.registerVaccine(recipientId, countryCode, vaccineCode)
                            }
                        }}
                            id="registerVaccineForm"
                        >
                            <Form.Group className="mb-3">
                                <Form.Label className='mt-3 fs-5'>Recipient Id</Form.Label>
                                <Form.Control ref={(input) => { this.recipientId = input }} type="text" placeholder="Enter recipient id" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className='mt-3 fs-5'>Country Code</Form.Label>
                                <Form.Control ref={(input) => { this.countryCode = input }} type="text" placeholder="Enter country code" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className='mt-3 fs-5'>Vaccine Code</Form.Label>
                                <Form.Control ref={(input) => { this.vaccineCode = input }} type="text" placeholder="Enter vaccine code" />
                            </Form.Group>
                            {
                                this.state.loading ?
                                    <div className="spinner-border mt-4" role="status" />
                                    :
                                    <Button className='mt-5 w-25' size='lg' variant="outline-secondary" type="submit">
                                        Add
                                    </Button>
                            }
                            <p className="fw-bold text-danger fs-6">
                                {this.state.errorMessage}
                            </p>
                        </Form>
                    </Card>
                </Container>
            </div>
        );
    }
}
