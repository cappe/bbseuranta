class TemplateRenderer
  include Callable

  TEMPLATE_PATH = "app/templates".freeze

  def initialize(template:, template_variables: {}, template_ext: '.erb')
    @template = template
    @template_ext = template_ext
    @template_variables = template_variables
  end

  def call
    ActionController::Base.render(
      file: file,
      locals: template_variables
    )
  end

  private

    attr_reader :lang,
                :template,
                :template_ext,
                :template_variables

    def lang
      template_variables[:lang]
    end

    def file
      "#{TEMPLATE_PATH}/#{template}.#{lang}#{template_ext}"
    end
end
