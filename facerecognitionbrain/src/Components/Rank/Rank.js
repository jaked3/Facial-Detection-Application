import React from 'react';

const Rank = ({name,entries}) => {
	return (
		<div className='white f1'>
			<div className='white f1'>
			{`${name}, your number of entries are...`}
			</div>
			{entries}
		</div>
		);
}

export default Rank;