import React from 'react';
import { Container } from 'react-bootstrap';

function About () {
  return (
    <Container className="my-5">
      <header class="jumbotron">
        <h1> About </h1>
      </header>

      <div>
        <p>This webpage allows to make reservations for holidays</p>
      </div>
    </Container>
  );
}

export default About;