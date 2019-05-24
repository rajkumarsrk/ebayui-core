'use strict';var renderBody = function renderBody(stream) {return stream.write('1');};
module.exports = {
    basicLinks: {
        a11yPreviousText: 'Previous page',
        a11yNextText: 'Next page',
        a11yCurrentText: 'Results Pagination - Page 2',
        items: [
        {
            type: 'previous',
            href: '#' },

        {
            renderBody: renderBody,
            href: '#' },

        {
            current: true,
            renderBody: renderBody,
            href: '#' },

        {
            renderBody: renderBody,
            href: '#' },

        {
            renderBody: renderBody,
            href: '#' },

        {
            renderBody: renderBody,
            href: '#' },

        {
            renderBody: renderBody,
            href: '#' },

        {
            renderBody: renderBody,
            href: '#' },

        {
            renderBody: renderBody,
            href: '#' },

        {
            renderBody: renderBody,
            href: '#' },

        {
            type: 'next',
            href: '#' }] },



    FifthSelected: {
        a11yPreviousText: 'Previous page',
        a11yNextText: 'Next page',
        a11yCurrentText: 'Results Pagination - Page 2',
        items: [
        {
            type: 'previous',
            href: '#' },

        {
            renderBody: renderBody,
            href: '#' },

        {
            renderBody: renderBody,
            href: '#' },

        {
            renderBody: renderBody,
            href: '#' },

        {
            renderBody: renderBody,
            href: '#' },

        {
            current: true,
            renderBody: renderBody,
            href: '#' },

        {
            renderBody: renderBody,
            href: '#' },

        {
            renderBody: renderBody,
            href: '#' },

        {
            renderBody: renderBody,
            href: '#' },

        {
            renderBody: renderBody,
            href: '#' },

        {
            type: 'next',
            href: '#' }] },



    EighthSelected: {
        a11yPreviousText: 'Previous page',
        a11yNextText: 'Next page',
        a11yCurrentText: 'Results Pagination - Page 2',
        items: [
        {
            type: 'previous',
            href: '#' },

        {
            renderBody: renderBody,
            href: '#' },

        {
            renderBody: renderBody,
            href: '#' },

        {
            renderBody: renderBody,
            href: '#' },

        {
            renderBody: renderBody,
            href: '#' },

        {
            renderBody: renderBody,
            href: '#' },

        {
            renderBody: renderBody,
            href: '#' },

        {
            renderBody: renderBody,
            href: '#' },

        {
            current: true,
            renderBody: renderBody,
            href: '#' },

        {
            renderBody: renderBody,
            href: '#' },

        {
            type: 'next',
            href: '#' }] },



    buttons: {
        a11yPreviousText: 'Previous page',
        a11yNextText: 'Next page',
        a11yCurrentText: 'Results Pagination - Page 2',
        items: [
        {
            type: 'previous' },

        {
            current: true,
            renderBody: renderBody },

        {
            renderBody: renderBody },

        {
            type: 'next' }] },



    basicLinksWithoutCurrent: {
        a11yPreviousText: 'Previous page',
        a11yNextText: 'Next page',
        a11yCurrentText: 'Results Pagination - Page X',
        items: [
        {
            type: 'previous',
            href: '#' },

        {
            renderBody: renderBody,
            href: '#' },

        {
            renderBody: renderBody,
            href: '#' },

        {
            type: 'next',
            href: '#' }] },



    basicLinksWithoutNavigation: {
        a11yPreviousText: 'Previous page',
        a11yNextText: 'Next page',
        a11yCurrentText: 'Results Pagination - Page 1',
        items: [
        {
            current: true,
            renderBody: renderBody,
            href: '#' }] },



    disabledNavigation: {
        a11yPreviousText: 'Previous page',
        a11yNextText: 'Next page',
        a11yCurrentText: 'Results Pagination - Page 2',
        items: [
        {
            type: 'previous',
            disabled: true },

        {
            current: true,
            renderBody: renderBody,
            href: '#' },

        {
            type: 'next',
            disabled: true }] } };