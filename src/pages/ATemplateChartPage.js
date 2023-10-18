import React from 'react';
import ChartBasePage from './ChartBasePage'; // 引入ChartBasePage
import DataListComponent from '../componentsUtils/DataListComponent';
import LineChartDiagram from '../componentsDiagram/LineChartDiagram';

class ATemplateChartPage extends React.Component {
    render() {
        return (
            <ChartBasePage>
                <aside>
                    {/* SIDEBAR */}
                </aside>
                
                <div className="Main-content">
                    {/* MAIN */}
                    <DataListComponent />
                    <LineChartDiagram />
                </div>
            </ChartBasePage>
        );
    }
}

export default ATemplateChartPage;
