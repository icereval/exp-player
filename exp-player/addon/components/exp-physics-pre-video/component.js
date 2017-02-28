import Ember from 'ember';

import layout from './template';
import ExpFrameBaseUnsafeComponent from '../../components/exp-frame-base-unsafe/component';

/**
 * @module exp-player
 * @submodule frames
 */

/**
@class ExpPhysicsPreVideo
@extends ExpFrameBaseUnsafe
@deprecated This is a frame for instructions given immediately before the "Your baby the physicist" video start, with hardcoded text. Use exp-lookit-text or exp-lookit-instructions instead.
*/

export default ExpFrameBaseUnsafeComponent.extend({
    // In the Lookit use case, the frame BEFORE the one that goes fullscreen must use "unsafe" saves (in order for
    //   the fullscreen event to register as being user-initiated and not from a promise handler) #LEI-369
    layout: layout,
    type: 'exp-physics-pre-video',
    didFinishSound: false,
    meta: {
        name: 'ExpPhysicsPreVideo',
        description: 'TODO: a description of this frame goes here.',
        parameters: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'A unique identifier for this item'
                },
                mustPlay: {
                    type: 'boolean',
                    description: 'Should the user be forced to play the clip before leaving the page?',
                    default: true
                }
            },
            required: ['id']
        },
        data: {
            type: 'object',
            properties: {  // We don't *need* to tell the server about this, but it might be nice to track usage of the setup page
                didFinishSound: {
                    type: 'boolean',
                    default: false
                },
                showWarning: {
                    type: 'boolean',
                    default: false
                }
            },
            required: ['didFinishSound', 'showWarning']
        }
    },

    actions: {
        soundPlayed() {
            this.set('didFinishSound', true);
            this.set('preventNext', false);
            this.set('showWarning', false);
        },
        checkAudioThenNext() {
            if (this.preventNext) {
                this.set('showWarning', true);
            } else {
                this.send('next');
            }
        }
    },

    preventNext: Ember.computed('mustPlay', 'didFinishSound', function() {
        if (!this.get('mustPlay')) {
            return false;
        } else {
            // Optionally force user to listen to clip before continuing
            return !this.get('didFinishSound');
        }
    })
});
