import layout from './template';

import ExpFrameBaseComponent from '../../components/exp-frame-base/component';
import FullScreen from '../../mixins/full-screen';
import MediaReload from '../../mixins/media-reload';
import VideoPause from '../../mixins/video-pause';

/**
 * @module exp-player
 * @submodule frames
 */

/**
@class ExpVideo
@extends ExpFrameBase
@deprecated This is a frame created as an early example of displaying videos on Lookit. It can be deleted if safe for other projects. For current example of displaying videos, see exp-video-physics.
*/

export default ExpFrameBaseComponent.extend(FullScreen, MediaReload, VideoPause, {
    // If fullscreen behavior in a series of videos is desired, may need to extend unsafebase frame in future;
    //   see exp-video-physics for comparison
    layout: layout,

    displayFullscreen: true,  // force fullscreen for all uses of this component, always
    fullScreenElementId: 'player-video',
    meta: {
        name: 'Video player',
        description: 'Component that plays a video',
        parameters: {
            type: 'object',
            properties: {
                autoforwardOnEnd: {  // Generally leave this true, since controls will be hidden for fullscreen videos
                    type: 'boolean',
                    description: 'Whether to automatically advance to the next frame when the video is complete',
                    default: true
                },
                autoplay: {
                    type: 'boolean',
                    description: 'Whether to autoplay the video on load',
                    default: true
                },
                poster: {
                    type: 'string',
                    description: 'A still image to show until the video starts playing',
                    default: ''
                },
                sources: {
                    type: 'string',
                    description: 'List of objects specifying video src and type',
                    default: []
                },
                introSources: {
                    type: 'string',
                    description: 'List of objects specifying intro video src and type',
                    default: []
                },
            }
        },
        data: {
            // This video does not explicitly capture any parameters from the userdata:
            type: 'object',
            properties: {  // We don't *need* to tell the server about this, but it might be nice to track usage of the setup page
                doingIntro: {
                    type: 'boolean',
                    default: true
                }
            },
            required: ['doingIntro']
        }
    },
    actions: {
        playNext: function() {
            if (this.get('doingIntro')) {
                this.set('doingIntro', false);
            } else {
                this.get('next')();
            }
        }
    }
});
