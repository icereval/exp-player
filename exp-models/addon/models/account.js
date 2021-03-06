/*
 Manage data about one or more documents in the accounts collection
 */
import Ember from 'ember';
import DS from 'ember-data';

import JamModel from '../mixins/jam-model';

function makeId() {
    // h/t http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export default DS.Model.extend(JamModel, {
    name: DS.attr('string'),
    password: DS.attr('string'),
    profiles: DS.attr('profiles'),
    permissions: DS.attr(),

    activeProfiles: Ember.computed.filterBy('profiles', 'deleted', false),

    history: DS.hasMany('history'),
    extra: DS.attr(),

    // Username should be immutable. We will use the id, which is already truncated from <namespace>.<collection>.(<recordId>) in jam-document-serializer
    username: Ember.computed.alias('id'),

    // Helper methods
    generateProfileId() {
        var id = makeId();
        var profileIds = this.get('profiles').map((profile) => profile.get('profileId').split('.')[0]);
        while (profileIds.indexOf(id) !== -1) {
            id = makeId();
        }
        return `${this.get('id')}.${id}`;
    },

    profileById(profileId) {
        // Scan the list of profiles and gets first one with matching ID (else undefined). Assumes profileIds are unique.
        var profiles = this.get('profiles') || [];
        var getProfile = function (item) {
            return item.get('profileId') === profileId;
        };

        return profiles.filter(getProfile)[0];
    },
    pastSessionsFor(experiment, profile, isCompleted) {
        var profileId = Ember.get(profile, 'profileId');

        // For most applications, we will care about the newest past sessions first. Fetch as many of those results
        // as possible so that any client side filtering has a chance of working as desired.
        let query = {
            sort: '-created_on',
            'page[size]': 100
        };

        if (profileId) {
            query['filter[profileId]'] = profileId;
        }
        if (typeof isCompleted !== 'undefined') {
            query['filter[completed]'] = isCompleted ? 1 : 0;
        }
        return this.get('store').query(experiment.get('sessionCollectionId'), query);
    }
});
