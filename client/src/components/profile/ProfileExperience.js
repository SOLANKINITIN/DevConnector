import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileExperience = ({
  experience: { company, title, location, to, from, current, description },
}) => {
  return (
    <div>
      <div>
        <h3 class='text-dark'>{company}</h3>
        <p>
          {' '}
          <Moment format='YYYY/MM/DD'>{from}</Moment> -{' '}
          {!to ? 'Now' : <Moment format='YYYY/MM/DD'>{to}</Moment>}
        </p>
        <p>
          <strong>Position: </strong>
          {title}
        </p>
        <p>
          <strong>Location: </strong>
          {location}
        </p>
        <p>
          <strong>Current: </strong>
          {current}
        </p>
        <p>
          <strong>Description: </strong>
          {description}
        </p>
      </div>
    </div>
  );
};

ProfileExperience.propTypes = {
  experience: PropTypes.array.isRequired,
};

export default ProfileExperience;
