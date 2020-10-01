import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileEducation = ({
  education: { school, degree, fieldofstudy, to, from, current, description },
}) => {
  return (
    <div>
      <div>
        <h3 class='text-dark'>{school}</h3>
        <p>
          {' '}
          <Moment format='YYYY/MM/DD'>{from}</Moment> -{' '}
          {!to ? 'Now' : <Moment format='YYYY/MM/DD'>{to}</Moment>}
        </p>
        <p>
          <strong>Position: </strong>
          {degree}
        </p>
        <p>
          <strong>Filed Of Study: </strong>
          {fieldofstudy}
        </p>
        <p>
          <strong>Description: </strong>
          {description}
        </p>
      </div>
    </div>
  );
};

ProfileEducation.propTypes = {
  education: PropTypes.array.isRequired,
};

export default ProfileEducation;
