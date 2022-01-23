import {ref, shallowRef} from "vue";
import * as Yup from "yup";

import FormText from "../../components/form/FormText.vue";
import FormSelect from '../../components/form/FormSelect.vue';
import FormTags from "../../components/form/FormTags.vue";
import FormTextEditor from "../../components/form/FormTextEditor.vue";

export const schema = shallowRef([
    {
        model: 'name',
        label: 'Company Name',
        component: FormText,
    },
    {
        model: 'email',
        label: 'Email',
        component: FormText,
        config: {
            type: 'email',
        }
    },
    {
        model: 'phone',
        label: 'Phone',
        component: FormText,
        config: {
            type: 'tel',
        }
    },
    {
        model: 'website',
        label: 'Website',
        component: FormText,
    },

    {
        model: 'industry',
        label: 'Industry',
        component: FormSelect,
        options: [
            {
                label: 'Accounting',
                value: 'accounting',
            },
            {
                label: 'Airlines/Aviation',
                value: 'airlines-aviation',
            },
            {
                label: 'Alternative Dispute Resolution',
                value: 'alternative-dispute-resolution',
            },
            {
                label: 'Alternative Medicine',
                value: 'alternative-medicine',
            },
            {
                label: 'Animation',
                value: 'animation',
            },
            {
                label: 'Apparel & Fashion',
                value: 'apparel-fashion',
            },
            {
                label: 'Architecture & Planning',
                value: 'architecture-planning',
            },
            {
                label: 'Arts and Crafts',
                value: 'arts-crafts',
            },
            {
                label: 'Automotive',
                value: 'automotive',
            },
            {
                label: 'Aviation & Aerospace',
                value: 'aviation-aerospace',
            },
            {
                label: 'Banking',
                value: 'banking',
            },
            {
                label: 'Biotechnology',
                value: 'biotechnology',
            },
            {
                label: 'Broadcast Media',
                value: 'broadcast-media',
            },
            {
                label: 'Building Materials',
                value: 'building-materials',
            },
            {
                label: 'Business Supplies and Equipment',
                value: 'business-supplies-equipment',
            },
            {
                label: 'Capital Markets',
                value: 'capital-markets',
            },
            {
                label: 'Chemicals',
                value: 'chemicals',
            },
            {
                label: 'Civic & Social Organization',
                value: 'civic-social-organization',
            },
        ]
    },
    {
        model: 'description',
        label: 'Description',
        component: FormTextEditor,
    },
    {
        model: 'tags',
        label: 'Tags',
        component: FormTags,
    },
])

export const validationSchema = Yup.object({
    name: Yup.string().required('Title is a required field'),
    email: Yup.string().email('Invalid email address').required('Email is a required field'),
    website: Yup.string().url('Please enter a valid URL'),
    phone: Yup.string().optional(),
    industry: Yup.string().required('Industry is a required field'),
    description: Yup.string().required('Description is a required field').min(8, 'Description must be at least 40 characters long'),
    tags: Yup.array().required('Tags is a required field').min(1, 'Enter at least one requirement'),
})

export const initialValues = ref({
    name: '',
    email: '',
    phone: '',
    website: '',
    industry: '',
    description: '',
    tags: [],
})
