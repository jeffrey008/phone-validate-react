import React, {useEffect, useState} from 'react';
import {Formik, Field, Form, FormikHelpers, useFormikContext} from 'formik';

import './App.css';

interface Values {
    phoneNumber: string;
}

function History(props: any) {
    const formikProps = useFormikContext()
    const revalidate = (number: string) => {
        formikProps.setFieldValue('phoneNumber', number);
    }


    return (
        <div>
            <h1>History</h1>
            <button type="button" className="btn btn-primary" onClick={props.clearHistory}>Clear history</button>
            {props.history.map((h: string, i: number) =>
                <div key={i}>
                    <h5>{h}</h5>
                    <button type="button" className="btn btn-primary" onClick={() => revalidate(h)}>Re-validate</button>
                </div>
            )}
        </div>

    )
}

function App() {
    const [history, setHistory] = useState<string[]>([]);
    const [response, setResponse] = useState<any>({});

    const clearHistory = () => {
        setHistory([])
    }


    return (
        <div className="App">
            <h1>Validation Form</h1>
            <Formik
                initialValues={{
                    phoneNumber: '',
                }}
                enableReinitialize={true}
                onSubmit={(
                    values: Values,
                    {setSubmitting, resetForm}: FormikHelpers<Values>
                ) => {
                    let newArr = [...history]; // copying the old array
                    newArr.push(values.phoneNumber);
                    setHistory(newArr)
                    fetch(`http://localhost:3001/validate-number?number=${values.phoneNumber}`)
                        .then(res => res.json())
                        .then(
                            (result) => {
                                setResponse(result);
                            },
                            // Note: it's important to handle errors here
                            // instead of a catch() block so that we don't swallow
                            // exceptions from actual bugs in components.
                            (error) => {
                                console.error(error)
                            }
                        )

                    resetForm();
                }}
            >
                <Form>
                    <div className="row">
                        <label htmlFor="phoneNumber" className="form-label">Phone Number (With country code)</label>
                        <div className="col-sm-10">
                            <Field id="phoneNumber" name="phoneNumber" className="form-control" required/>
                        </div>
                    </div>


                    <button className="btn btn-primary" type="submit">Submit</button>
                    <h1>Response of {history[history.length - 1]}</h1>
                        <table className="table table-bordered table-hover table-condensed">
                            <thead>
                            <tr>
                                <th title="Field #1">valid</th>
                                <th title="Field #2">number</th>
                                <th title="Field #3">local_format</th>
                                <th title="Field #4">international_format</th>
                                <th title="Field #5">country_prefix</th>
                                <th title="Field #6">country_code</th>
                                <th title="Field #7">country_name</th>
                                <th title="Field #8">location</th>
                                <th title="Field #9">carrier</th>
                                <th title="Field #10">line_type</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{response.valid ? 'True' : 'False'}</td>
                                <td>{response.number}</td>
                                <td>{response.local_format}</td>
                                <td>{response.international_format}</td>
                                <td>{response.country_prefix}</td>
                                <td>{response.country_code}</td>
                                <td>{response.country_name}</td>
                                <td>{response.location}</td>
                                <td>{response.carrier}</td>
                                <td>{response.line_type}</td>
                            </tr>
                            </tbody>
                                     </table>

                    <History history={history} clearHistory={clearHistory}/>
                </Form>
            </Formik>

        </div>
    );
}

export default App;
