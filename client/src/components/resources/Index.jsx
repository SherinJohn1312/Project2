import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Index = function ({user}) {

  const [resources, setResources] = useState([]);

  useEffect(() => {
    (async () => {
      await getResources();
    })();
  }, []);

  const getResources = async () => {
    const resourcesResp = await Axios.get('/api/resources');
    if (resourcesResp.status === 200) setResources(resourcesResp.data);
  };

  const deleteResource = async resource => {
    try {
      const resp = await Axios.post('/api/resources/delete', {
        id: resource._id
      });

      if (resp.status === 200) toast("The resource was deleted successfully", {type: toast.TYPE.SUCCESS});

      await getResources();
    } catch (error) {
      toast("There was an error deleting the resource", {type: toast.TYPE.ERROR});
    }
  };


  return (
    <Container className="my-5">
      <header>
        <h1>Reservations</h1>
      </header>

      <hr/>

      <div className="content">
        {resources && resources.map((resource, i) => (
          <div key={i} className="card my-3">
            <div className="card-header">
              <h5 className="card-title">
                {resource.title}
              </h5>
            </div>

            <div className="card-body">
              <p className="card-text">
                A {resource.groupSize} {resource.groupSize > 1 ? 'people' : 'person'} group for the "{resource.resourceType}" haunted resource on the date of {resource.date}.
              </p>
            </div>

            {user ? (
              <div className="card-footer">
                <Link to={{
                  pathname: "/resources/edit",
                  state: {
                    id: resource._id
                  }
                }}>
                  <i className="fa fa-edit"></i>
                </Link>

                <button type="button" onClick={() => deleteResource(resource)}>
                  <i className="fa fa-trash"></i>
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </Container>
  );

};

export default Index;