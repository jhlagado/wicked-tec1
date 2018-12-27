import { html } from 'lit-html'
import { withProps } from '../util';

export const instructions = withProps({

    render() {
        return html`
        <h1>TEC-1</h1>
        <table style="width: 600px">
            <tbody>
                <tr style="text-align: left;">
                    <th>Key</th>
                    <th>Description</th>
                    <th>TEC-1</th>
                </tr>
                <tr>
                    <td>0-9,A-F</td>
                    <td>Hex digits</td>
                    <td></td>
                </tr>
                <tr>
                    <td>ESC</td>
                    <td>Reset</td>
                    <td>(RES)</td>
                </tr>
                <tr>
                    <td>tab</td>
                    <td>Mode</td>
                    <td>(AD)</td>
                </tr>
                <tr>
                    <td>Enter</td>
                    <td>Run</td>
                    <td>(GO)</td>
                </tr>
                <tr>
                    <td>Arrow Up</td>
                    <td>Increase</td>
                    <td>(+)</td>
                </tr>
                <tr>
                    <td>Arrow Down</td>
                    <td>Decrease</td>
                    <td>(-)</td>
                </tr>
                <tr>
                    <td>Space</td>
                    <td>Pause/Resume</td>
                    <td></td>
                </tr>
            </tbody>
        </table>
`;
    }
});
