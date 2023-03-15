import PaperProvider from '@config/PaperProvider';
import React, { useState } from 'react';
import Navigator from './packages/web/configs/route';

const App = () => {

	return (
		<PaperProvider>
			<React.Fragment>
				<Navigator />
			</React.Fragment>
		</PaperProvider>
	);
};

export default App;
